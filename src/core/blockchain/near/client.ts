import { BlockchainGenericClient, IFeeOptions, ChainIdType, IBlockInfo } from '../types';
import { networks } from './networks';
import {
    createAccount,
    transfer,
    addKey,
    fullAccessKey,
    createTransaction,
    signTransaction
} from 'nearlib/src.ts/transaction';
import { PublicKey, KeyPair, serialize } from 'nearlib/src.ts/utils';
import BN from 'bn.js';
import BigNumber from 'bignumber.js';
import sha256 from 'js-sha256';

export class Client extends BlockchainGenericClient {
    constructor(chainId: ChainIdType) {
        super(chainId, networks);
    }

    public async getBalance(address: string): Promise<BigNumber> {
        const res = await this.rpc.call('query', [`account/${address}`, '']);

        // return format.formatNearAmount(res.result.amount); // ,4
        return new BigNumber(res.result.amount);
    }

    public async getNonce(address: string, publicKey?: string): Promise<number> {
        const res = await this.rpc.call('query', [`access_key/${address}/${publicKey}`, '']);

        return res.result.nonce + 1;
    }

    public async getCurrentBlock(): Promise<IBlockInfo> {
        const res = await this.rpc.call('status');

        return {
            number: res?.result?.sync_info?.latest_block_height,
            hash: res?.result?.sync_info?.latest_block_hash
        };
    }

    public async sendTransaction(signedTransaction): Promise<string> {
        const res = await this.rpc.call('broadcast_tx_commit', [signedTransaction]);

        return res?.result?.transaction?.hash;
    }

    public async calculateFees(
        from: string,
        to: string,
        amount?,
        contractAddress?
    ): Promise<IFeeOptions> {
        return {
            gasPrice: '937144500000',
            gasLimit: '1'
        };
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
        chainId: ChainIdType
    ): Promise<any> {
        chainId = 'testnet'; // todo remove this

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

        // setup KeyPair
        const keyPair = KeyPair.fromString(SENDER_PRIVATE_KEY);

        let nonce = await this.getNonce(SENDER_ACCOUNT_ID, SENDER_PUBLIC_KEY);

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
        const signer: any = {
            async signMessage(message) {
                const hash = new Uint8Array(sha256.sha256.array(message));
                return keyPair.sign(hash);
            }
        };
        const signedTx = await signTransaction(tx, signer, SENDER_ACCOUNT_ID, chainId);

        // send transaction
        // broadcast_tx_commit
        const res = await this.rpc.call('broadcast_tx_commit', [
            Buffer.from(signedTx[1].encode()).toString('base64')
        ]);

        return res.result;
    }
}
