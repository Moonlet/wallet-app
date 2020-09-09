import { BlockchainGenericClient, ChainIdType, IBlockInfo, TransactionType } from '../types';
import { networks } from './networks';
import BigNumber from 'bignumber.js';
import { config } from './config';
import { NameService } from './name-service';
import { TokenType } from '../types/token';
import { ClientUtils } from './client-utils';
import { createTransaction, signTransaction, deleteAccount } from 'near-api-js/lib/transaction';
import { KeyPair, serialize } from 'near-api-js/lib/utils';
import sha256 from 'js-sha256';
import { StakingPool } from './contracts/staking-pool';
import { INearAccount, NearAccountType } from './types';

export class Client extends BlockchainGenericClient {
    public stakingPool: StakingPool;

    constructor(chainId: ChainIdType) {
        super(chainId, networks);

        this.nameService = new NameService(this);
        this.utils = new ClientUtils(this);
        this.stakingPool = new StakingPool();
    }

    public async getBalance(address: string): Promise<BigNumber> {
        try {
            const res = await this.getAccount(address);
            return res.amount;
        } catch {
            return new BigNumber(0);
        }
    }

    public async getNonce(address: string, publicKey: string): Promise<number> {
        const res = await this.http.jsonRpc('query', {
            request_type: 'view_access_key',
            finality: 'final',
            account_id: address,
            public_key: publicKey
        });

        return res?.result?.nonce + 1 || 1;
    }

    public async getCurrentBlock(): Promise<IBlockInfo> {
        const res = await this.http.jsonRpc('status');

        return {
            number: res?.result?.sync_info?.latest_block_height,
            hash: res?.result?.sync_info?.latest_block_hash
        };
    }

    public async sendTransaction(signedTransaction): Promise<string> {
        const res = await this.http.jsonRpc('broadcast_tx_async', [signedTransaction]);

        return res.result;
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

    /**
     * Get Account
     * @param accountId
     */
    public async getAccount(accountId: string): Promise<INearAccount> {
        try {
            const res = await this.http.jsonRpc('query', {
                request_type: 'view_account',
                finality: 'final',
                account_id: accountId
            });

            if (res?.result) {
                // Account exists
                return {
                    address: accountId,
                    name: accountId,
                    amount: new BigNumber(res.result.amount),
                    exists: true,
                    valid: true,
                    type:
                        res.result.code_hash === '11111111111111111111111111111111'
                            ? NearAccountType.DEFAULT
                            : NearAccountType.CONTRACT
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
                } else {
                    return Promise.reject(res.error);
                }
            }
        } catch (err) {
            return Promise.reject(err);
        }
    }

    /**
     * Recover Account
     * @param accountId
     * @param publicKey
     */
    public async viewAccountAccessKey(accountId: string, publicKey: string): Promise<any> {
        const res = await this.http.jsonRpc('query', {
            request_type: 'view_access_key',
            finality: 'final',
            account_id: accountId,
            public_key: publicKey
        });

        return res.result;
    }

    /**
     * Delete Account
     * @param accountId
     * @param beneficiaryId
     * @param senderPrivateKey
     */
    public async deleteNearAccount(
        accountId: string,
        beneficiaryId: string,
        senderPrivateKey: string
    ) {
        const status = await this.http.jsonRpc('status');

        // transaction actions
        const actions = [deleteAccount(beneficiaryId)];

        // setup KeyPair
        const keyPair = KeyPair.fromString(senderPrivateKey);

        let nonce = await this.getNonce(accountId, keyPair.getPublicKey().toString());

        // create transaction
        const tx = createTransaction(
            accountId,
            keyPair.getPublicKey(),
            accountId,
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
        const signedTx = await signTransaction(tx, signer, accountId, this.chainId.toString());

        // send transaction
        const res = await this.http.jsonRpc('broadcast_tx_commit', [
            Buffer.from(signedTx[1].encode()).toString('base64')
        ]);

        return res?.result || res?.error;
    }
}
