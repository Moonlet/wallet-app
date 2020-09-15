import ZilApp from './zil-interface';
import * as zcrypto from '@zilliqa-js/crypto';
import { IBlockchainTransaction } from '../../../../blockchain/types';
import BigNumber from 'bignumber.js';
// import Long from 'long';
// import * as ZilliqaJsAccountUtil from '@zilliqa-js/account/dist/util';

export class Zil {
    private app = null;
    constructor(transport) {
        this.app = new ZilApp.default(transport);
    }

    /**
     * @param {number} index index of account
     * @param {number} derivationIndex index of derivation for an account
     * @param {number} path derivation path, values accepted: live, legacy
     */
    public getAddress(index: number, derivationIndex: number = 0, path: string) {
        return this.app.getPublicAddress(`${index}`).then(data => {
            return {
                address: data.pubAddr,
                publicKey: data.publicKey
            };
        });
    }

    public signTransaction = async (
        index: number,
        derivationIndex: number = 0,
        path: string,
        tx: IBlockchainTransaction
    ): Promise<any> => {
        const transaction: any = {
            // tslint:disable-next-line: no-bitwise
            version: (Number(tx.chainId) << 16) + 1,
            nonce: tx.nonce,
            toAddr: zcrypto
                .fromBech32Address(tx.toAddress)
                .replace('0x', '')
                .toLowerCase(),
            amount: tx.amount.toString(),
            pubKey: tx.publicKey,
            gasPrice: new BigNumber(tx.feeOptions.gasPrice).toString(),
            gasLimit: new BigNumber(tx.feeOptions.gasLimit).toNumber(),
            signature: '',
            code: '',
            data: '',
            priority: false
        };
        const signed = await this.app.signTxn(index, transaction);

        transaction.signature = signed.sig;
        transaction.amount = transaction.amount.toString();
        transaction.gasLimit = transaction.gasLimit.toString();
        transaction.gasPrice = transaction.gasPrice.toString();
        transaction.toAddr = zcrypto.toChecksumAddress(transaction.toAddr).replace('0x', '');
        return transaction;
    };

    public getInfo() {
        return this.app.getVersion();
    }
}
