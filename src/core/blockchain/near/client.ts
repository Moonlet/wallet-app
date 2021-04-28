import {
    Blockchain,
    BlockchainGenericClient,
    ChainIdType,
    IBlockInfo,
    TransactionType,
    IBalance
} from '../types';
import { networks } from './networks';
import BigNumber from 'bignumber.js';
import { config } from './config';
import { NameService } from './name-service';
import { PosBasicActionType, TokenType } from '../types/token';
import { ClientUtils } from './client-utils';
import { createTransaction, signTransaction, deleteAccount } from 'near-api-js/lib/transaction';
import { KeyPair, serialize } from 'near-api-js/lib/utils';
import sha256 from 'js-sha256';
import { StakingPool } from './contracts/staking-pool';
import {
    INearAccount,
    NearAccountType,
    NearAccountViewMethods,
    NearQueryRequestTypes
} from './types';
import { ApiClient } from '../../utils/api-client/api-client';
import { Lockup } from './contracts/lockup';
import { translate } from '../../i18n';
import { AccountType, IAccountState } from '../../../redux/wallets/state';

export class Client extends BlockchainGenericClient {
    public stakingPool: StakingPool;
    public lockup: Lockup;

    constructor(chainId: ChainIdType) {
        super(chainId, networks);

        this.nameService = new NameService(this);
        this.utils = new ClientUtils(this);
        this.stakingPool = new StakingPool();
        this.lockup = new Lockup();
    }

    public async getBalance(address: string): Promise<IBalance> {
        try {
            const data = await new ApiClient().validators.getBalance(
                address,
                Blockchain.NEAR,
                this.chainId.toString()
            );
            return {
                total: data?.balance.total || new BigNumber(0),
                available: data?.balance.available || new BigNumber(0)
            };
        } catch {
            return { total: new BigNumber(0), available: new BigNumber(0) };
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

    public async sendTransaction(signedTransaction): Promise<{ txHash: string; rawResponse: any }> {
        try {
            const res = await this.http.jsonRpc('broadcast_tx_async', [signedTransaction]);

            if (res?.result?.transaction?.hash || res?.result) {
                return {
                    txHash: res?.result?.transaction?.hash || res?.result,
                    rawResponse: res
                };
            } else {
                throw new Error(res);
            }
        } catch (error) {
            throw new Error(error);
        }
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

    public async getMinimumAmountDelegate(): Promise<BigNumber> {
        return new BigNumber(0);
    }

    public async viewAccessKey(publicKey: string, accountId: string) {
        const res = await this.http.jsonRpc('query', {
            request_type: 'view_access_key',
            finality: 'final',
            account_id: accountId,
            public_key: publicKey
        });

        return res;
    }

    public async getTransactionStatusPolling(txHash: string, accountId: string) {
        return new Promise((resolve, reject) => {
            const interval = setInterval(async () => {
                const res = await this.http.jsonRpc('tx', [txHash, accountId]);

                if (res?.result?.status?.hasOwnProperty('SuccessValue')) {
                    resolve(txHash);
                    clearInterval(interval);
                    return;
                } else if (res?.result?.status?.Failure) {
                    reject(`Error: ${res}`);
                    clearInterval(interval);
                    return;
                } else {
                    // continue
                    // TODO: maybe set a timeout when to stop this?
                }
            }, 1000);
        });
    }

    public async contractCall(options: { contractName: string; methodName: string; args?: any }) {
        const res = await this.http.jsonRpc('query', {
            request_type: NearQueryRequestTypes.CALL_FUNCTION,
            finality: 'final',
            account_id: options.contractName,
            method_name: options.methodName,
            args_base64: Buffer.from(JSON.stringify(options.args || {})).toString('base64')
        });

        if (res?.result?.result) {
            try {
                const decodedData = Buffer.from(res.result.result).toString();
                return JSON.parse(decodedData);
            } catch (err) {
                throw new Error(err);
            }
        } else {
            throw new Error(
                JSON.stringify({
                    event: 'contractCall',
                    errorMessage: 'Invalid contract call response result',
                    contractName: options.contractName,
                    methodName: options.methodName,
                    args: options.args
                })
            );
        }
    }

    public async canPerformAction(
        action: PosBasicActionType,
        options: {
            account: IAccountState;
            validatorAddress: string[];
        }
    ): Promise<{ value: boolean; message: string }> {
        switch (action) {
            case PosBasicActionType.DELEGATE:
            case PosBasicActionType.STAKE:
            case PosBasicActionType.UNSTAKE:
                try {
                    if (
                        options.account.type === AccountType.LOCKUP_CONTRACT &&
                        options.validatorAddress.length > 1
                    ) {
                        return Promise.resolve({
                            value: false,
                            message: translate('Validator.multipleNodes')
                        });
                    }

                    const [stakingAccountId, depositBalance] = await Promise.all([
                        this.contractCall({
                            contractName: options.account.address,
                            methodName: NearAccountViewMethods.GET_STAKING_POOL_ACCOUNT_ID
                        }),
                        this.contractCall({
                            contractName: options.account.address,
                            methodName: NearAccountViewMethods.GET_KNOWN_DEPOSITED_BALANCE
                        })
                    ]);

                    if (
                        stakingAccountId &&
                        stakingAccountId !== options.validatorAddress[0] &&
                        depositBalance !== '0'
                    ) {
                        return Promise.resolve({
                            value: false,
                            message: translate('Validator.alreadyStaked', {
                                stakedValidator: stakingAccountId,
                                selectedValidator: options.validatorAddress[0]
                            })
                        });
                    }
                } catch (err) {
                    // no need to handle this
                }

                return Promise.resolve({
                    value: true,
                    message: ''
                });

            default:
                return Promise.resolve({ value: true, message: '' });
        }
    }
}
