import CosmosApp from 'ledger-cosmos-js';
import { IHardwareWalletApp } from '../types';
import { IBlockchainTransaction } from '../../../../blockchain/types';
import { sortObject } from '../../../../blockchain/common/transaction';
import { signatureImport } from 'secp256k1';

export class Cosmos implements IHardwareWalletApp {
    private app: CosmosApp;
    constructor(transport) {
        this.app = new CosmosApp(transport);
    }

    /**
     * @param {number} index index of account
     * @param {number} derivationIndex index of derivation for an account
     * @param {number} path derivation path, values accepted: live, legacy
     */
    public async getAddress(index: number, derivationIndex: number = 0, path: string) {
        const derivationPath = [44, 118, 0, 0, index];
        const address = await this.app.getAddressAndPubKey(derivationPath, 'cosmos');

        return {
            address: address.bech32_address,
            publicKey: address.compressed_pk.toString('hex')
        };
    }

    public signTransaction = async (
        index: number,
        derivationIndex: number = 0,
        path: string,
        tx: IBlockchainTransaction
    ): Promise<any> => {
        const derivationPath = [44, 118, 0, 0, index];
        const response = await this.app.sign(
            derivationPath,
            JSON.stringify(sortObject(tx.additionalInfo.stdSignMsg))
        );
        const signatureBase64 = Buffer.from(signatureImport(response.signature)).toString('base64');
        const publicBase64 = Buffer.from(tx.publicKey, 'hex').toString('base64');

        const signedTx = {
            tx: {
                msg: tx.additionalInfo.stdSignMsg.msgs,
                fee: tx.additionalInfo.stdSignMsg.fee,
                signatures: [
                    {
                        signature: signatureBase64,
                        pub_key: {
                            type: 'tendermint/PubKeySecp256k1',
                            value: publicBase64
                        }
                    }
                ],
                memo: tx.additionalInfo.memo
            },
            // The supported return types includes "block"(return after tx commit), "sync"(return afer CheckTx) and "async"(return right away).
            mode: 'sync'
        };

        return signedTx;
    };

    public async getInfo() {
        return new Promise(async (resolve, reject) => {
            const info = await this.app.getVersion();
            if (info.error_message !== 'No errors') {
                return reject();
            }
            resolve(info);
        });
    }
}
