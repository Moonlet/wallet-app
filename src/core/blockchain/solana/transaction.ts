import {
    AbstractBlockchainTransactionUtils,
    IBlockchainTransaction,
    ITransferTransaction,
    TransactionType
} from '../types';

import { TransactionStatus } from '../../wallet/types';
import { TokenType } from '../types/token';
import { Solana } from '.';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';
// import SystemProgram from '@solana/web3.js/src/system-program';
import { SystemProgram } from '@solana/web3.js/src/index';
// import { Account } from '@solana/web3.js/src/account';
import { Transaction } from '@solana/web3.js/src/transaction';
// import { sendAndConfirmTransaction } from '@solana/web3.js/src/util/send-and-confirm-transaction';

// import solanaWeb3 from '@solana/web3.js';

export class SolanaTransactionUtils extends AbstractBlockchainTransactionUtils {
    public async sign(tx: IBlockchainTransaction, privateKey: string): Promise<any> {
        // console.log('herrrrr', SystemProgram);
        const trx: Transaction = SystemProgram.transfer({
            fromPubkey: tx.address,
            toPubkey: tx.toAddress,
            lamports: '1'
        });

        trx.sign();
        // trx.recentBlockhash = await this._recentBlockhash(false;);

        // console.log('transaction', JSON.stringify(trx));

        // let signature = '';
        // try {
        //     signature = await sendAndConfirmTransaction(
        //         this.web3sol,
        //         transaction,
        //         [this.state.account],
        //         { confirmations: 1 }
        //     );
        // } catch (err) {
        //     throw err;
        // }

        return;

        const transaction: any = {
            // tslint:disable-next-line: no-bitwise
            version: (Number(tx.chainId) << 16) + 1, // add replay protection
            toAddr: tx.toAddress,
            nonce: tx.nonce,
            // pubKey,
            amount: tx.amount,
            gasPrice: tx.feeOptions.gasPrice.toString(),
            gasLimit: tx.feeOptions.gasLimit.toString(),
            code: '',
            data: tx.data?.raw || '',
            signature: '',
            priority: true
        };

        // encode transaction for signing
        // sign transaction
        const signature = '';

        // update transaction
        transaction.signature = signature;
        transaction.amount = transaction.amount.toString();
        transaction.gasLimit = transaction.gasLimit.toString();
        transaction.gasPrice = transaction.gasPrice.toString();
        transaction.toAddr = transaction.toAddr;

        return transaction;
    }

    public async buildTransferTransaction(
        tx: ITransferTransaction
    ): Promise<IBlockchainTransaction> {
        const client = Solana.getClient(tx.chainId);
        const nonce = await client.getNonce(tx.account.address, tx.account.publicKey);

        const tokenInfo = getTokenConfig(tx.account.blockchain, tx.token);
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
            nonce,
            status: TransactionStatus.PENDING
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
