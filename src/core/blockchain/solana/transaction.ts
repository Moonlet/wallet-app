import {
    AbstractBlockchainTransactionUtils,
    IBlockchainTransaction,
    ITransferTransaction,
    TransactionType
} from '../types';

import { TransactionStatus } from '../../wallet/types';
import { TokenType } from '../types/token';
import { Solana } from '.';
import { Client as SolanaClient } from './client';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';
import { SystemProgram } from '@solana/web3.js/src/system-program';
import { PublicKey } from '@solana/web3.js/src/publickey';
import { Account } from '@solana/web3.js/src/account';
import { Transaction } from '@solana/web3.js/src/transaction';
import { SolanaTransactionActionType } from './types';
import { decode as bs58Decode } from 'bs58';
// import solanaWeb3 from '@solana/web3.js';

export class SolanaTransactionUtils extends AbstractBlockchainTransactionUtils {
    public async sign(tx: IBlockchainTransaction, privateKey: string): Promise<any> {
        const account = new Account(bs58Decode(privateKey));
        const transaction = new Transaction();
        const transactionInstruction = tx.additionalInfo.actions[0].instruction;
        transaction.add(transactionInstruction); // TO DO - change this when integrating staking
        transaction.recentBlockhash = tx.additionalInfo.currentBlockHash;
        transaction.sign(...[account]);
        return transaction.serialize();
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
                actions: [
                    {
                        type: SolanaTransactionActionType.TRANSFER,
                        instruction: SystemProgram.transfer({
                            fromPubkey: new PublicKey(tx.account.address),
                            toPubkey: new PublicKey(tx.toAddress),
                            lamports: tx.amount
                        })
                    }
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
