import { BlockchainGenericClient, ChainIdType, IBlockInfo, TransactionType } from '../types';
import { networks } from './networks';
import BigNumber from 'bignumber.js';
import { config } from './config';
import { NameService } from './name-service';
import { INearAccount } from '.';
import { TokenType } from '../types/token';
import { ClientUtils } from './client-utils';

export class Client extends BlockchainGenericClient {
    constructor(chainId: ChainIdType) {
        super(chainId, networks);

        this.nameService = new NameService(this);
        this.utils = new ClientUtils(this);
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
                } else {
                    // handle this
                }
            }
        } catch (err) {
            Promise.reject(err);
        }
    }

    public async recoverAccount(accountId: string, publicKey: string): Promise<any> {
        const res = await this.http.jsonRpc('query', {
            request_type: 'view_access_key',
            finality: 'final',
            account_id: accountId,
            public_key: publicKey
        });

        return res.result;
    }
}
