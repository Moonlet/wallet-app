import EthApp from '@ledgerhq/hw-app-eth';
import { IHardwareWalletApp } from '../types';
import { IBlockchainTransaction } from '../../../../blockchain/types';
import { Transaction } from 'ethereumjs-tx';
import BigNumber from 'bignumber.js';

export class Eth implements IHardwareWalletApp {
    private app: EthApp;
    constructor(transport) {
        this.app = new EthApp(transport);
    }

    public getPath(index, derivationIndex, path) {
        switch (path) {
            case 'legacy':
                return `44'/60'/${index}'/${derivationIndex}`;
            case 'live':
            default:
                return `44'/60'/${index}'/0/${derivationIndex}`;
        }
    }

    /**
     * @param {number} index index of account
     * @param {number} derivationIndex index of derivation for an account
     * @param {number} path derivation path, values accepted: live, legacy
     */
    public getAddress(index: number, derivationIndex: number = 0, path: string) {
        return this.app.getAddress(this.getPath(index, derivationIndex, path), true);
    }

    public signTransaction = async (
        index: number,
        derivationIndex: number = 0,
        path: string,
        tx: IBlockchainTransaction
    ): Promise<any> => {
        const transaction = new Transaction(
            {
                nonce: '0x' + new BigNumber(tx.options.nonce).toString(16),
                gasPrice: '0x' + new BigNumber(tx.options.gasPrice).toString(16),
                gasLimit: '0x' + new BigNumber(tx.options.gasLimit).toString(16),
                to: tx.to,
                value: '0x' + tx.amount.toString(16)
            },
            {
                chain: tx.options.chainId
            }
        );

        transaction.raw[6] = Buffer.from([tx.options.chainId]); // v
        transaction.raw[7] = Buffer.from([]); // r
        transaction.raw[8] = Buffer.from([]); // s

        const result = await this.app.signTransaction(
            this.getPath(index, derivationIndex, path),
            transaction.serialize().toString('hex')
        );

        transaction.v = Buffer.from(result.v, 'hex');
        transaction.r = Buffer.from(result.r, 'hex');
        transaction.s = Buffer.from(result.s, 'hex');

        return '0x' + transaction.serialize().toString('hex');
    };

    public getInfo() {
        return this.app.getAppConfiguration();
    }
}
