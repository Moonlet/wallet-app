import ZilApp from './zil-interface';
import * as zcrypto from '@zilliqa-js/crypto';
import { IBlockchainTransaction } from '../../../../blockchain/types';
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
        const data = await this.app.getPublicKey(`${index}`);

        const transaction: any = {
            // tslint:disable-next-line: no-bitwise
            version: (tx.options.chainId << 16) + 1,
            nonce: tx.options.nonce,
            toAddr: zcrypto
                .fromBech32Address(tx.to)
                .replace('0x', '')
                .toLowerCase(),
            amount: tx.amount.toString(),
            pubKey: data.pubKey,
            gasPrice: tx.options.gasPrice.toString(),
            gasLimit: tx.options.gasLimit.toNumber(),
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
