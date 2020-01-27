import { BlockchainGenericClient } from '../types';
import { BigNumber } from 'bignumber.js';
import { networks } from './networks';
import * as nearlib from 'nearlib';
import BN from 'bn.js';

export class Client extends BlockchainGenericClient {
    constructor(chainId: number) {
        super(chainId, networks);
    }

    public async getBalance(address: string): Promise<BigNumber> {
        throw new Error('Not Implemented');
    }

    public async getNonce(address: string, publicKey?: string): Promise<number> {
        throw new Error('Not Implemented');
    }

    public sendTransaction(transaction): Promise<string> {
        throw new Error('Not Implemented');
    }

    public async calculateFees(from: string, to: string) {
        throw new Error('Not Implemented');
    }

    public async createAccount(newAccountId, publicKey: string, chainId: any) {
        chainId = 'testnet';

        const SENDER_ACCOUNT_ID = 'tibi';
        const SENDER_PUBLIC_KEY = 'ed25519:HnJokj1mWhDK2UTdRTjUEaj6djedbVhs1Y5N1x6APpjX';
        const SENDER_PRIVATE_KEY =
            'ed25519:47XC2WW9NWmnvpAE48Jjy8qdgrEjHaovXFDGUrFhKnvvD1mv8PAtSav97wroJx5E8fd3Z2zQGZwRA7e3krzQAm49';

        const status = await this.rpc.call('status');
        const actions = [
            nearlib.transactions.createAccount(),
            nearlib.transactions.transfer(new BN('10000000000000000000000')),
            nearlib.transactions.addKey(
                nearlib.utils.PublicKey.fromString(publicKey),
                nearlib.transactions.fullAccessKey()
            )
        ];

        const keyStore = new nearlib.keyStores.InMemoryKeyStore();
        const keyPair = nearlib.utils.KeyPair.fromString(SENDER_PRIVATE_KEY);
        await keyStore.setKey(chainId, SENDER_ACCOUNT_ID, keyPair);
        const signer = new nearlib.InMemorySigner(keyStore);
        const tx = nearlib.transactions.createTransaction(
            SENDER_ACCOUNT_ID,
            nearlib.utils.PublicKey.fromString(SENDER_PUBLIC_KEY),
            newAccountId,
            await this.getNonce(SENDER_ACCOUNT_ID, SENDER_PUBLIC_KEY),
            actions,
            nearlib.utils.serialize.base_decode(status.result.sync_info.latest_block_hash)
        );
        const signedTx = await nearlib.transactions.signTransaction(
            tx,
            signer,
            SENDER_ACCOUNT_ID,
            chainId
        );
        const res = await this.rpc.call('broadcast_tx_async', [
            Buffer.from(signedTx[1].encode()).toString('base64')
        ]);
        return res.result;
    }
}
