import { IBlockchainTransaction, ITransferTransaction, TransactionType } from '../types';
import { privateToPublic } from './account';

import * as ZilliqaJsAccountUtil from '@zilliqa-js/account/dist/util';
import { BN, Long } from '@zilliqa-js/util';
import * as schnorr from '@zilliqa-js/crypto/dist/schnorr';
import { fromBech32Address } from '@zilliqa-js/crypto/dist/bech32';
import { toChecksumAddress } from '@zilliqa-js/crypto/dist/util';
import { TransactionStatus } from '../../wallet/types';

const schnorrSign = (msg: Buffer, privateKey: string): string => {
    const pubKey = privateToPublic(privateKey);

    const sig = schnorr.sign(msg, Buffer.from(privateKey, 'hex'), Buffer.from(pubKey, 'hex'));

    let r = sig.r.toString('hex');
    let s = sig.s.toString('hex');
    while (r.length < 64) {
        r = '0' + r;
    }
    while (s.length < 64) {
        s = '0' + s;
    }

    return r + s;
};

export const sign = async (tx: IBlockchainTransaction, privateKey: string): Promise<any> => {
    const pubKey = privateToPublic(privateKey);
    const transaction: any = {
        // tslint:disable-next-line: no-bitwise
        version: (Number(tx.chainId) << 16) + 1, // add replay protection
        toAddr: fromBech32Address(tx.toAddress)
            .replace('0x', '')
            .toLowerCase(),
        nonce: tx.nonce,
        pubKey,
        amount: new BN(tx.amount),
        gasPrice: new BN(tx.feeOptions.gasPrice.toString()),
        gasLimit: Long.fromString(tx.feeOptions.gasLimit.toString()),
        code: '',
        data: '',
        signature: ''
    };

    // encode transaction for signing
    const encodedTransaction = ZilliqaJsAccountUtil.encodeTransactionProto(transaction);
    // sign transaction
    const signature = schnorrSign(encodedTransaction, privateKey);

    // update transaction
    transaction.signature = signature;
    transaction.amount = transaction.amount.toString();
    transaction.gasLimit = transaction.gasLimit.toString();
    transaction.gasPrice = transaction.gasPrice.toString();
    transaction.toAddr = toChecksumAddress(transaction.toAddr).replace('0x', '');

    return transaction;
};

export const buildTransferTransaction = (tx: ITransferTransaction): IBlockchainTransaction => {
    const tokenInfo = tx.account.tokens[tx.token];
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
        broadcatedOnBlock: undefined,
        nonce: tx.nonce,
        status: TransactionStatus.PENDING
    };
};
