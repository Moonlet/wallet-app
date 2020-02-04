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
import { config } from './config';

export class Client extends BlockchainGenericClient {
    constructor(chainId: ChainIdType) {
        super(chainId, networks);
    }

    public async getBalance(address: string): Promise<BigNumber> {
        const res = await this.rpc.call('query', [`account/${address}`, '']);

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
        const gasPrice = config.feeOptions.defaults.gasPrice.toString();
        const gasLimit = config.feeOptions.defaults.gasLimit.toString();
        const feeTotal = new BigNumber(gasPrice).multipliedBy(new BigNumber(gasLimit)).toString();

        return {
            gasPrice,
            gasLimit,
            feeTotal
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
        const SENDER_ACCOUNT_ID = 'tibi';
        const SENDER_PRIVATE_KEY =
            'ed25519:47XC2WW9NWmnvpAE48Jjy8qdgrEjHaovXFDGUrFhKnvvD1mv8PAtSav97wroJx5E8fd3Z2zQGZwRA7e3krzQAm49';

        const status = await this.rpc.call('status');
        const amount = new BN('10000000000000000000000');

        // transaction actions
        const actions = [
            createAccount(),
            transfer(amount),
            addKey(PublicKey.fromString(publicKey), fullAccessKey())
        ];

        // setup KeyPair
        const keyPair = KeyPair.fromString(SENDER_PRIVATE_KEY);

        let nonce = await this.getNonce(SENDER_ACCOUNT_ID, keyPair.getPublicKey().toString());

        // create transaction
        const tx = createTransaction(
            SENDER_ACCOUNT_ID,
            keyPair.getPublicKey(),
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
        const signedTx = await signTransaction(tx, signer, SENDER_ACCOUNT_ID, chainId.toString());

        // send transaction
        const res = await this.rpc.call('broadcast_tx_commit', [
            Buffer.from(signedTx[1].encode()).toString('base64')
        ]);

        return res.result;
    }
}
