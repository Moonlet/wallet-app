import { BlockchainGenericClient, ChainIdType, IBlockInfo, TransactionType } from '../types';
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
import { NameService } from './name-service';
import { INearAccount } from '.';
import { TokenType } from '../types/token';
import { ClientUtils } from './client-utils';

export class Client extends BlockchainGenericClient {
    constructor(chainId: ChainIdType) {
        super(chainId, networks);

        this.nameService = new NameService(this);
        this.utils = new ClientUtils();
    }

    public async getBalance(address: string): Promise<BigNumber> {
        try {
            const res = await this.getAccount(address);
            return res.amount;
        } catch {
            return new BigNumber(0);
        }
    }

    public async getNonce(address: string, publicKey?: string): Promise<number> {
        const res = await this.http.jsonRpc('query', [`access_key/${address}/${publicKey}`, '']);

        return res.result.nonce + 1;
    }

    public async getCurrentBlock(): Promise<IBlockInfo> {
        const res = await this.http.jsonRpc('status');

        return {
            number: res?.result?.sync_info?.latest_block_height,
            hash: res?.result?.sync_info?.latest_block_hash
        };
    }

    public async sendTransaction(signedTransaction): Promise<string> {
        const res = await this.http.jsonRpc('broadcast_tx_commit', [signedTransaction]);

        return res?.result?.transaction?.hash;
    }

    public async getFees(
        transactionType: TransactionType,
        data: {
            from?: string;
            to?: string;
            amount?: string;
            contractAddress?: string;
            raw?: string;
        },
        tokenType: TokenType = TokenType.NATIVE
    ) {
        const gasPrice = config.feeOptions.defaults.gasPrice.toFixed();
        const gasLimit = config.feeOptions.defaults.gasLimit[tokenType].toFixed();
        const feeTotal = new BigNumber(gasPrice).multipliedBy(new BigNumber(gasLimit)).toFixed();

        return {
            gasPrice,
            gasLimit,
            feeTotal
        };
    }

    public async getAccount(accountId: string): Promise<INearAccount> {
        try {
            const res = await this.http.jsonRpc('query', [`account/${accountId}`, '']);

            if (res?.result) {
                // Account exists
                return {
                    address: accountId,
                    name: accountId,
                    amount: new BigNumber(res.result.amount),
                    exists: true,
                    valid: true
                };
            } else if (res?.error) {
                // Account does not exist | it's not created
                const errorMessage = res.error.data;

                if (errorMessage.includes('not exist')) {
                    // Account id it's valid
                    // error message: {"error": {"code": -32000, "data": "account mm does not exist while viewing", "message": "Server error"}, "id": 0, "jsonrpc": "2.0"}
                    return {
                        address: accountId,
                        name: accountId,
                        amount: new BigNumber(0),
                        exists: false,
                        valid: true
                    };
                } else if (errorMessage.includes('not valid')) {
                    // Account is not valid
                    // error message: {"error": {"code": -32000, "data": "Account ID '??' is not valid", "message": "Server error"}, "id": 0, "jsonrpc": "2.0"}
                    return {
                        address: accountId,
                        name: accountId,
                        amount: new BigNumber(0),
                        exists: false,
                        valid: false
                    };
                }
            }
        } catch (err) {
            Promise.reject(err);
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

        const status = await this.http.jsonRpc('status');
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
        const res = await this.http.jsonRpc('broadcast_tx_commit', [
            Buffer.from(signedTx[1].encode()).toString('base64')
        ]);

        return res.result;
    }
}
