import {
    AbstractBlockchainTransactionUtils,
    IBlockchainTransaction,
    IPosTransaction,
    ITransferTransaction,
    TransactionType
} from '../types';

import { TransactionStatus } from '../../wallet/types';
import { PosBasicActionType, TokenType } from '../types/token';
import { Solana } from '.';
import { Client as SolanaClient } from './client';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';
import { StakeProgram } from '@solana/web3.js/src/stake-program';
import { SystemProgram } from '@solana/web3.js/src/system-program';
import { PublicKey } from '@solana/web3.js/src/publickey';
import { Account } from '@solana/web3.js/src/account';
import { Transaction } from '@solana/web3.js/src/transaction';
import { SolanaTransactionInstructionType } from './types';
import { decode as bs58Decode } from 'bs58';
import BigNumber from 'bignumber.js';
import { cloneDeep } from 'lodash';
import { splitStake } from '../../utils/balance';
import { Contracts } from '../solana/config';

export class SolanaTransactionUtils extends AbstractBlockchainTransactionUtils {
    public async sign(tx: IBlockchainTransaction, privateKey: string): Promise<any> {
        const account = new Account(bs58Decode(privateKey));
        let transaction;

        switch (tx.additionalInfo.type) {
            case SolanaTransactionInstructionType.CREATE_ACCOUNT_WITH_SEED: {
                transaction = StakeProgram.createAccountWithSeed(tx.additionalInfo.instructions[0]);
            }
            case SolanaTransactionInstructionType.DELEGATE_STAKE: {
                transaction = StakeProgram.delegate(tx.additionalInfo.instructions[0]);
            }
            case SolanaTransactionInstructionType.TRANSFER: {
                transaction = new Transaction();
                transaction.add(tx.additionalInfo.instructions[0]);
            }
        }

        transaction.recentBlockhash = tx.additionalInfo.currentBlockHash;
        transaction.sign(...[account]);
        return transaction.serialize();
    }

    public async buildPosTransaction(
        tx: IPosTransaction,
        transactionType: PosBasicActionType
    ): Promise<IBlockchainTransaction[]> {
        const client = Solana.getClient(tx.chainId);

        const transactions: IBlockchainTransaction[] = [];

        switch (transactionType) {
            case PosBasicActionType.DELEGATE: {
                const splitAmount = splitStake(new BigNumber(tx.amount), tx.validators.length);

                for (const validator of tx.validators) {
                    const txStake: IPosTransaction = cloneDeep(tx);
                    txStake.amount = splitAmount.toFixed(0, BigNumber.ROUND_DOWN);
                    const transaction: IBlockchainTransaction = await client.contracts[
                        Contracts.STAKING
                    ].delegateStake(txStake, validator);
                    transactions.push(transaction);
                }
                break;
            }
        }

        return transactions;
    }

    public async buildTransferTransaction(
        tx: ITransferTransaction
    ): Promise<IBlockchainTransaction> {
        const client = Solana.getClient(tx.chainId) as SolanaClient;

        const tokenInfo = getTokenConfig(tx.account.blockchain, tx.token);
        const blockHash = await client.getCurrentBlockHash();
        const blockInfo = await client.getCurrentBlock();

        return {
            date: {
                created: Date.now(),
                signed: Date.now(),
                broadcasted: Date.now(),
                confirmed: Date.now()
            },
            blockchain: tx.account.blockchain,
            chainId: tx.chainId,
            type: TransactionType.TRANSFER,
            token: tokenInfo,

            address: tx.account.address,
            publicKey: tx.account.publicKey,

            toAddress: tx.toAddress,
            amount: tx.amount,
            feeOptions: tx.feeOptions,
            broadcastedOnBlock: blockInfo?.number,
            nonce: 0, // not used
            status: TransactionStatus.PENDING,
            additionalInfo: {
                currentBlockHash: blockHash,

                type: SolanaTransactionInstructionType.TRANSFER,
                instructions: [
                    SystemProgram.transfer({
                        fromPubkey: new PublicKey(tx.account.address),
                        toPubkey: new PublicKey(tx.toAddress),
                        lamports: tx.amount
                    })
                ]
            }
        };
    }

    public getTransactionAmount(tx: IBlockchainTransaction): string {
        const tokenInfo = getTokenConfig(tx.blockchain, tx.token?.symbol);
        if (tokenInfo.type === TokenType.ERC20) {
            return tx?.data?.params[1];
        } else {
            return tx.amount;
        }
    }
}
