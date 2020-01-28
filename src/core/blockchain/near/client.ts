import { BlockchainGenericClient, IFeeOptions } from '../types';
import { networks } from './networks';
import {
    createAccount,
    transfer,
    addKey,
    fullAccessKey,
    createTransaction,
    signTransaction
} from 'nearlib/src.ts/transaction';
import { PublicKey, KeyPair, serialize, format } from 'nearlib/src.ts/utils';
import { InMemoryKeyStore } from 'nearlib/src.ts/key_stores';
import { InMemorySigner } from 'nearlib/src.ts';
import BN from 'bn.js';

export class Client extends BlockchainGenericClient {
    constructor(chainId: number) {
        super(chainId, networks);
    }

    public async getBalance(address: string): Promise<any> {
        const res = await this.rpc.call('query', [`account/${address}`, '']);

        return format.formatNearAmount(res.result.amount); // ,4
    }

    public async getNonce(address: string, publicKey?: string): Promise<number> {
        const res = await this.rpc.call('query', [`access_key/${address}/${publicKey}`, '']);

        return res.result.nonce;
    }

    public sendTransaction(transaction): Promise<string> {
        throw new Error('Not Implemented');
    }

    public async calculateFees(
        from: string,
        to: string,
        amount?,
        contractAddress?
    ): Promise<IFeeOptions> {
        throw new Error('Not Implemented');
    }

    public async checkAccountIdValid(accountId: string): Promise<boolean> {
        try {
            const res = await this.rpc.call('query', [`account/${accountId}`, '']);

            if (res.result) {
                // account id already taken
                return false;
            } else {
                // valid account id
                return true;
            }
        } catch (err) {
            return false;
        }
    }

    public async createAccount(
        newAccountId: string,
        publicKey: string,
        chainId: any
    ): Promise<any> {
        chainId = 'testnet';

        const SENDER_ACCOUNT_ID = 'tibi';
        const SENDER_PUBLIC_KEY = 'ed25519:HnJokj1mWhDK2UTdRTjUEaj6djedbVhs1Y5N1x6APpjX';
        const SENDER_PRIVATE_KEY =
            'ed25519:47XC2WW9NWmnvpAE48Jjy8qdgrEjHaovXFDGUrFhKnvvD1mv8PAtSav97wroJx5E8fd3Z2zQGZwRA7e3krzQAm49';

        const status = await this.rpc.call('status');

        // transaction actions
        const actions = [
            createAccount(),
            transfer(new BN('10000000000000000000000')),
            addKey(PublicKey.fromString(publicKey), fullAccessKey())
        ];

        // setup KeyStore
        const keyStore = new InMemoryKeyStore();
        const keyPair = KeyPair.fromString(SENDER_PRIVATE_KEY);
        await keyStore.setKey(chainId, SENDER_ACCOUNT_ID, keyPair);

        // setup Signer
        const signer = new InMemorySigner(keyStore);

        var nonce = await this.getNonce(SENDER_ACCOUNT_ID, SENDER_PUBLIC_KEY);

        // create transaction
        const tx = createTransaction(
            SENDER_ACCOUNT_ID,
            PublicKey.fromString(SENDER_PUBLIC_KEY),
            newAccountId,
            ++nonce,
            actions,
            serialize.base_decode(status.result.sync_info.latest_block_hash)
        );

        // sign transaction
        const signedTx = await signTransaction(tx, signer, SENDER_ACCOUNT_ID, chainId);

        // send transaction
        const res = await this.rpc.call('broadcast_tx_async', [
            Buffer.from(signedTx[1].encode()).toString('base64')
        ]);

        return res.result;
    }
}
