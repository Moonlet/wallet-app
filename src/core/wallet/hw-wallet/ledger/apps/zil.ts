import ZilApp from './zil-interface';
import * as zcrypto from '@zilliqa-js/crypto';
import { IBlockchainTransaction } from '../../../../blockchain/types';

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
        return this.app.getPublicKey(`${index}`).then(data => {
            return {
                address: zcrypto.toBech32Address(zcrypto.getAddressFromPublicKey(data.publicKey)),
                pubKey: data.publicKey
            };
        });
    }

    public signTransaction = async (
        index: number,
        derivationIndex: number = 0,
        path: string,
        tx: IBlockchainTransaction
    ): Promise<any> => {
        const params = {
            amount: tx.amount,
            gasPrice: tx.options.gasPrice,
            gasLimit: tx.options.gasLimit,
            toAddr: tx.to,
            version: 0
        };

        return this.app.signTxn(index, params);
    };

    public getInfo() {
        return this.app.getVersion();
    }
}
