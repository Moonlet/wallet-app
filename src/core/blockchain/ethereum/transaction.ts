import { IEthereumTxOptions } from '.';
import { IBlockchainTransaction } from '../types';
import { Transaction } from 'ethereumjs-tx';
import BigNumber from 'bignumber.js';

export const sign = async (
    tx: IBlockchainTransaction<IEthereumTxOptions>,
    privateKey: string
): Promise<any> => {
    const transaction = new Transaction(
        {
            nonce: '0x' + new BigNumber(tx.options.nonce).toString(16),
            gasPrice: '0x' + new BigNumber(tx.options.gasPrice).toString(16),
            gasLimit: '0x' + new BigNumber(tx.options.gasLimit).toString(16),
            to: tx.to,
            value: '0x' + tx.amount.toString(16)
            // data: "0x" + tx.options.data,
            // chainId: "0x" + new BigNumber(tx.options.chainId).toString(16),

            // v: "0x" + new BigNumber(tx.options.chainId).toString(16),
            // r: "0x00",
            // s: "0x00"
        },
        {
            chain: tx.options.chainId
        }
    );

    transaction.sign(Buffer.from(privateKey, 'hex'));
    return '0x' + transaction.serialize().toString('hex');
};
