import { IBlockchainTransaction, ITransferTransaction } from '../types';
import { IZilliqaTxOptions } from '.';
import { privateToPublic } from './account';

import * as ZilliqaJsAccountUtil from '@zilliqa-js/account/dist/util';
import { BN, Long } from '@zilliqa-js/util';
import * as schnorr from '@zilliqa-js/crypto/dist/schnorr';
import { fromBech32Address } from '@zilliqa-js/crypto/dist/bech32';
import { toChecksumAddress } from '@zilliqa-js/crypto/dist/util';

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

export const sign = async (
    tx: IBlockchainTransaction<IZilliqaTxOptions>,
    privateKey: string
): Promise<any> => {
    const pubKey = privateToPublic(privateKey);
    const transaction: any = {
        // tslint:disable-next-line: no-bitwise
        version: (tx.options.chainId << 16) + 1, // add replay protection
        toAddr: fromBech32Address(tx.to)
            .replace('0x', '')
            .toLowerCase(),
        nonce: tx.options.nonce,
        pubKey,
        amount: new BN(tx.amount.toString()),
        gasPrice: new BN(tx.options.gasPrice),
        gasLimit: Long.fromNumber(tx.options.gasLimit),
        code: tx.options.code || '',
        data: tx.options.data || '',
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

    // console.log('signed transaction', transaction);
    return transaction;
};

export const buildTransferTransaction = (
    tx: ITransferTransaction
): IBlockchainTransaction<IZilliqaTxOptions> => {
    return {
        from: tx.account.address,
        to: tx.toAddress,
        amount: tx.amount,
        options: {
            nonce: tx.nonce,
            gasPrice: tx.gasPrice.toNumber(),
            gasLimit: tx.gasLimit,
            chainId: tx.chainId,
            publicKey: tx.account.publicKey
        }
    };
};
