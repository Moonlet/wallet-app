import EthApp from '@ledgerhq/hw-app-eth';
import { IHardwareWalletApp } from '../types';
import { IBlockchainTransaction } from '../../../../blockchain/types';
import {
    toHex,
    makeEven,
    trimLeadingZero
} from '../../../../blockchain/celo/library/signing-utils';
import { encode } from '../../../../blockchain/celo/library/rlp';
// import BigNumber from 'bignumber.js';

export class Celo implements IHardwareWalletApp {
    private app: EthApp;
    constructor(transport) {
        this.app = new EthApp(transport);
    }

    public getPath(index, derivationIndex, path) {
        return `44'/52752'/${index}'/0/${derivationIndex}`;
    }

    /**
     * @param {number} index index of account
     * @param {number} derivationIndex index of derivation for an account
     * @param {number} path derivation path, values accepted: live, legacy
     */
    public getAddress(index: number, derivationIndex: number = 0, path: string) {
        return this.app.getAddress(this.getPath(index, derivationIndex, path), true, false);
    }

    public signTransaction = async (
        index: number,
        derivationIndex: number = 0,
        path: string,
        tx: IBlockchainTransaction
    ): Promise<any> => {
        const txData = [
            toHex(tx.nonce),
            toHex(tx.feeOptions.gasPrice),
            toHex(tx.feeOptions.gasLimit),
            '0x', // feeCurrency
            '0x', // gatewayFeeRecipient
            '0x', // gatewayFee
            (tx.toAddress || '0x').toLowerCase(),
            tx.amount === '0' ? '0x' : toHex(tx.amount),
            (tx.data.raw || '0x').toLowerCase(),
            toHex(tx.chainId || 1)
        ];

        const encodedTx = encode(txData.concat(['0x', '0x'])).replace('0x', '');

        const signature = await this.app.signTransaction(
            this.getPath(index, derivationIndex, path),
            encodedTx
        );

        const addToV = Number(tx.chainId) * 2 + 35;
        const rawTx = txData
            .slice(0, 9)
            .concat([toHex(addToV), '0x' + signature.r, '0x' + signature.s]);

        rawTx[9] = makeEven(trimLeadingZero(rawTx[9]));
        rawTx[10] = makeEven(trimLeadingZero(rawTx[10]));
        rawTx[11] = makeEven(trimLeadingZero(rawTx[11]));

        return encode(rawTx);
    };

    public getInfo() {
        return this.app.getAppConfiguration();
    }

    public signMessage = async (
        index: number,
        derivationIndex: number,
        path: string,
        message: string
    ): Promise<any> => {
        throw new Error('signMessage NOT IMPLEMENTED');
    };
}
