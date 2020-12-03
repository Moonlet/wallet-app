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
import { cloneDeep } from 'lodash';
import { config, Contracts } from '../solana/config';
import { splitStake } from '../../utils/balance';
import BigNumber from 'bignumber.js';
import { selectStakeAccounts } from './contracts/base-contract';

export class SolanaTransactionUtils extends AbstractBlockchainTransactionUtils {
    public async sign(tx: IBlockchainTransaction, privateKey: string): Promise<any> {
        const account = new Account(bs58Decode(privateKey));
        const client = Solana.getClient(tx.chainId) as SolanaClient;
        let transaction;

        const blockHash = await client.getCurrentBlockHash();

        switch (tx.additionalInfo.type) {
            case SolanaTransactionInstructionType.CREATE_ACCOUNT_WITH_SEED:
                transaction = StakeProgram.createAccountWithSeed(tx.additionalInfo.instructions[0]);
                break;
            case SolanaTransactionInstructionType.DELEGATE_STAKE:
                transaction = StakeProgram.delegate(tx.additionalInfo.instructions[0]);
                break;
            case SolanaTransactionInstructionType.UNSTAKE:
                transaction = StakeProgram.deactivate(tx.additionalInfo.instructions[0]);
                break;
            case SolanaTransactionInstructionType.SPLIT_STAKE:
                transaction = StakeProgram.split(tx.additionalInfo.instructions[0]);
                break;

            case SolanaTransactionInstructionType.TRANSFER:
                transaction = new Transaction();
                transaction.add(tx.additionalInfo.instructions[0]);
                break;
        }

        transaction.recentBlockhash = blockHash;

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
            case PosBasicActionType.DELEGATE:
                const allStakeAccounts =
                    tx.account.tokens[client.chainId][config.coin].balance?.detailed;

                const splitAmount = splitStake(new BigNumber(tx.amount), tx.validators.length);

                const usedStakedAccounts: string[] = [];

                for (const validator of tx.validators) {
                    const selectedStakeAccounts = await selectStakeAccounts(
                        tx.account.address,
                        allStakeAccounts,
                        PosBasicActionType.DELEGATE,
                        splitAmount.toFixed(),
                        usedStakedAccounts
                    );

                    for (const key in selectedStakeAccounts) {
                        if (selectedStakeAccounts[key]) {
                            const stakeAccount = selectedStakeAccounts[key];

                            if (stakeAccount.options?.shouldCreate) {
                                const txCreate: IPosTransaction = cloneDeep(tx);
                                txCreate.extraFields.stakeAccountKey = key;
                                txCreate.extraFields.stakeAccountIndex = stakeAccount.options.index;
                                txCreate.amount = new BigNumber(stakeAccount.amount).toFixed(
                                    0,
                                    BigNumber.ROUND_DOWN
                                );
                                const transactionCreate: IBlockchainTransaction = await client.contracts[
                                    Contracts.STAKING
                                ].createStakeAccountWithSeed(txCreate);
                                transactions.push(transactionCreate);
                            }

                            if (stakeAccount.options?.shouldSplit) {
                                const txSplit: IPosTransaction = cloneDeep(tx);
                                txSplit.extraFields.stakeAccountKey = key;
                                txSplit.amount = new BigNumber(stakeAccount.amount).toFixed(
                                    0,
                                    BigNumber.ROUND_DOWN
                                );
                                txSplit.extraFields.stakeAccountKey =
                                    stakeAccount.options.splitFrom;
                                const transactionSplit: IBlockchainTransaction = await client.contracts[
                                    Contracts.STAKING
                                ].splitStake(txSplit, key);
                                transactions.push(transactionSplit);
                            }

                            const txStake: IPosTransaction = cloneDeep(tx);
                            txStake.amount = new BigNumber(stakeAccount.amount).toFixed(
                                0,
                                BigNumber.ROUND_DOWN
                            );
                            txStake.extraFields.stakeAccountKey = key;
                            const transaction: IBlockchainTransaction = await client.contracts[
                                Contracts.STAKING
                            ].delegateStake(txStake, validator);
                            transactions.push(transaction);
                            usedStakedAccounts.push(key);
                        }
                    }
                }
                break;
            case PosBasicActionType.UNSTAKE:
                const transactionUnstake: IBlockchainTransaction = await client.contracts[
                    Contracts.STAKING
                ].unStake(cloneDeep(tx), tx.validators[0]);
                transactions.push(transactionUnstake);
                break;
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
