import { IBlockchainTransaction } from '../../../../blockchain/types';
import { encode as bs58Encode, decode as bs58Decode } from 'bs58';
import {
    createTransaction,
    transfer,
    functionCall,
    signTransaction
} from 'near-api-js/lib/transaction';
import { PublicKey } from 'near-api-js/lib/utils';

import { base_decode } from 'near-api-js/lib/utils/serialize';
import { NearTransactionActionType } from '../../../../blockchain/near/types';
import BN from 'bn.js';
// import Long from 'long';
// import * as ZilliqaJsAccountUtil from '@zilliqa-js/account/dist/util';

function bip32PathToBytes(path) {
    const parts = path.split('/');
    return Buffer.concat(
        parts
            .map(part =>
                part.endsWith(`'`)
                    ? // tslint:disable-next-line:no-bitwise
                      Math.abs(parseInt(part.slice(0, -1), 10)) | 0x80000000
                    : Math.abs(parseInt(part, 10))
            )
            .map(i32 =>
                // tslint:disable-next-line:no-bitwise
                Buffer.from([(i32 >> 24) & 0xff, (i32 >> 16) & 0xff, (i32 >> 8) & 0xff, i32 & 0xff])
            )
    );
}

const networkId = 'W'.charCodeAt(0);

export class Near {
    constructor(private transport) {}

    private getPath(index) {
        index = 1;
        return `44'/397'/0'/0'/${index}'`; // +1 because near uses index 1 not 0.
    }

    /**
     * @param {number} index index of account
     * @param {number} derivationIndex index of derivation for an account
     * @param {number} path derivation path, values accepted: live, legacy
     */
    public async getAddress(index: number, derivationIndex: number = 0, path: string) {
        // path = path || DEFAULT_PATH;
        const response = await this.transport.send(
            0x80,
            4,
            0,
            networkId,
            bip32PathToBytes(this.getPath(index))
        );
        const pubKey = bs58Encode(Buffer.from(response.subarray(0, -2)));
        return {
            address: Buffer.from(bs58Decode(pubKey)).toString('hex'),
            publicKey: pubKey
        };
    }

    public signTransaction = async (
        index: number,
        derivationIndex: number = 0,
        path: string,
        tx: IBlockchainTransaction
    ): Promise<any> => {
        // transaction actions
        const actions = tx.additionalInfo.actions
            .map(action => {
                switch (action.type) {
                    case NearTransactionActionType.TRANSFER:
                        return transfer(new BN(tx.amount));

                    case NearTransactionActionType.FUNCTION_CALL:
                        // @ts-ignore
                        return functionCall(...action.params);

                    default:
                        return false;
                }
            })
            .filter(Boolean);

        // create transaction
        const nearTx = createTransaction(
            tx.address,
            PublicKey.fromString(tx.publicKey),
            tx.toAddress,
            tx.nonce,
            actions as any,
            base_decode(tx.additionalInfo.currentBlockHash)
        );

        // const transactionData = nearTx.encode();

        // sign transaction
        const signer: any = {
            signMessage: async transactionData => {
                // 128 - 5 service bytes
                const CHUNK_SIZE = 123;
                const allData = Buffer.concat([
                    bip32PathToBytes(this.getPath(index)),
                    transactionData
                ]);
                for (let offset = 0; offset < allData.length; offset += CHUNK_SIZE) {
                    const chunk = Buffer.from(allData.subarray(offset, offset + CHUNK_SIZE));
                    const isLastChunk = offset + CHUNK_SIZE >= allData.length;
                    const response = await this.transport.send(
                        0x80,
                        2,
                        isLastChunk ? 0x80 : 0,
                        networkId,
                        chunk
                    );
                    if (isLastChunk) {
                        return {
                            signature: Buffer.from(response.subarray(0, -2)),
                            publicKey: PublicKey.fromString(tx.publicKey)
                        };
                    }
                }
            },
            async getPublicKey() {
                return PublicKey.fromString(tx.publicKey);
            }
        };

        const signedTx = await signTransaction(nearTx, signer, tx.address, tx.chainId as string);

        return Buffer.from(signedTx[1].encode()).toString('base64');
    };

    public async getInfo() {
        const response = await this.transport.send(0x80, 6, 0, 0);
        const [major, minor, patch] = Array.from(response);
        return `${major}.${minor}.${patch}`;
    }
}
