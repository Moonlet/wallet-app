import ZilApp from './zil-interface';
import * as zcrypto from '@zilliqa-js/crypto';

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

    public signTransaction(
        index: number,
        derivationIndex: number = 0,
        path: string,
        txRaw: string
    ) {
        // console.log({ index, txRaw, derivationIndex, path }, JSON.stringify(txRaw));
        return this.app.signTxn(index, txRaw);
    }

    public getInfo() {
        return this.app.getVersion();
    }
}
