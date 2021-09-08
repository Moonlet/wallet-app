import {
    BlockchainGenericClient,
    ChainIdType,
    IBlockInfo,
    TransactionMessageText,
    TransactionType,
    IBalance,
    IFeeOptions,
    Contracts,
    ITransactionFees,
    TypedTransaction
} from '../types';
import { networks } from './networks';
import { BigNumber } from 'bignumber.js';
import { config } from './config';
import abi from 'ethereumjs-abi';
import { Erc20Client } from './tokens/erc20-client';
import { TokenType } from '../types/token';
import { NameService } from './name-service';
import { ClientUtils } from './client-utils';
import { Ethereum } from '.';
import { fixEthAddress } from '../../utils/format-address';
import CONFIG from '../../../config';
import { HttpClient } from '../../utils/http-client';
import {
    captureException as SentryCaptureException,
    addBreadcrumb as SentryAddBreadcrumb
} from '@sentry/react-native';
import { Staking } from './contracts/staking';
import { MethodSignature } from './types';
import { getContract } from './contracts/base-contract';
import { ApiClient } from '../../utils/api-client/api-client';

export class Client extends BlockchainGenericClient {
    constructor(chainId: ChainIdType) {
        super(chainId, networks);
        this.tokens[TokenType.ERC20] = new Erc20Client(this);
        this.nameService = new NameService(this);
        this.utils = new ClientUtils(this);
        this.contracts[Contracts.STAKING] = new Staking(this);
    }

    public async getBalance(address: string): Promise<IBalance> {
        return this.http.jsonRpc('eth_getBalance', [fixEthAddress(address), 'latest']).then(res => {
            return {
                total: new BigNumber(res.result, 16),
                available: new BigNumber(res.result, 16)
            };
        });
    }

    public getNonce(address: string): Promise<number> {
        return this.http
            .jsonRpc('eth_getTransactionCount', [fixEthAddress(address), 'latest'])
            .then(res => {
                return new BigNumber(res.result, 16).toNumber();
            });
    }

    public sendTransaction(transaction): Promise<{ txHash: string; rawResponse: any }> {
        return this.http.jsonRpc('eth_sendRawTransaction', [transaction]).then(res => {
            if (res.result) {
                return {
                    txHash: res.result,
                    rawResponse: res
                };
            }

            const errorMessage: string = res.error.message;
            if (errorMessage.includes('transaction underpriced')) {
                return Promise.reject(TransactionMessageText.TR_UNDERPRICED);
            }
            if (errorMessage.includes('insufficient funds for gas')) {
                return Promise.reject(TransactionMessageText.NOT_ENOUGH_TOKENS);
            }
        });
    }

    public getCurrentBlock(): Promise<IBlockInfo> {
        return this.http.jsonRpc('eth_blockNumber').then(res => {
            return {
                number: new BigNumber(res.result, 16).toNumber()
            };
        });
    }

    public async getBaseFeeHistory(): Promise<BigNumber> {
        return this.http.jsonRpc('eth_feeHistory', ['0x1', 'latest', []]).then(res => {
            return new BigNumber(res.result?.baseFeePerGas[0], 16);
        });
    }

    public async getMaxPriorityFee(): Promise<BigNumber> {
        return this.http.jsonRpc('eth_maxPriorityFeePerGas', []).then(res => {
            return new BigNumber(res.result, 16);
        });
    }

    public async getTransactionFees(txHash: string): Promise<ITransactionFees> {
        try {
            const confirmedTxRes = await this.utils.getTransaction(txHash);

            if (confirmedTxRes) {
                return {
                    gasPrice: confirmedTxRes.feeOptions.gasPrice,
                    gasLimit: confirmedTxRes.feeOptions.gasLimit,
                    gasUsed: confirmedTxRes.feeOptions.feeTotal,
                    feeTotal: confirmedTxRes.feeOptions.feeTotal,
                    maxFeePerGas: confirmedTxRes.feeOptions.maxFeePerGas || undefined,
                    maxPriorityFeePerGas:
                        confirmedTxRes.feeOptions.maxPriorityFeePerGas || undefined
                };
            } else {
                return;
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    public async callContract(contractAddress, methodSignature, params: any[] = []) {
        const signature = methodSignature.split(':');
        const method = signature[0];
        let returnTypes = [];
        if (signature[1]) {
            returnTypes = signature[1]
                .replace('(', '')
                .replace(')', '')
                .split(',')
                .filter(Boolean)
                .map(t => t.trim());
        }

        const response = await this.http.jsonRpc('eth_call', [
            {
                to: contractAddress,
                data: '0x' + abi.simpleEncode(method, ...params).toString('hex')
            },
            'latest'
        ]);

        const dataBuffer = Buffer.from(response.result.replace('0x', ''), 'hex');

        const result = abi.rawDecode(returnTypes, dataBuffer);

        if (result.length === 1) {
            return result.toString();
        } else {
            return result.map(r => r.toString());
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
        typedTransaction: TypedTransaction,
        tokenType: TokenType = TokenType.NATIVE
    ): Promise<IFeeOptions> {
        if (typedTransaction === TypedTransaction.TYPE_0)
            return this.estimateLegacyTransactions(transactionType, data, tokenType);
        else return this.estimateEip1559Transactions(transactionType, data, tokenType);
    }

    private async estimateEip1559Transactions(
        transactionType: TransactionType,
        data: {
            from?: string;
            to?: string;
            amount?: string;
            contractAddress?: string;
            raw?: string;
        },
        tokenType: TokenType = TokenType.NATIVE
    ): Promise<IFeeOptions> {
        try {
            const rpcCalls = [];

            switch (transactionType) {
                case TransactionType.TRANSFER: {
                    data.contractAddress
                        ? rpcCalls.push(
                              this.estimateGas(
                                  false,
                                  data.from,
                                  data.to,
                                  data.contractAddress,
                                  new BigNumber(data.amount),
                                  '0x' +
                                      abi
                                          .simpleEncode(
                                              MethodSignature.TRANSFER,
                                              data.to,
                                              new BigNumber(data.amount).toFixed()
                                          )
                                          .toString('hex')
                              )
                          )
                        : rpcCalls.push(this.estimateGas(false, data.from, data.to));
                    break;
                }
                case TransactionType.CONTRACT_CALL: {
                    rpcCalls.push(
                        this.estimateGas(
                            false,
                            data.from,
                            data.to,
                            data.contractAddress,
                            new BigNumber(data.amount),
                            data.raw
                        )
                    );
                    break;
                }
            }
            let presets: {
                low: {
                    maxFeePerGas: BigNumber;
                    maxPriorityFeePerGas: BigNumber;
                };
                medium: {
                    maxFeePerGas: BigNumber;
                    maxPriorityFeePerGas: BigNumber;
                };
                high: {
                    maxFeePerGas: BigNumber;
                    maxPriorityFeePerGas: BigNumber;
                };
            };

            const keyGasLimitErc20 = `ethereum.${this.chainId.toString()}.fees.gasLimit.erc20`;

            rpcCalls.push(
                this.getBaseFeeHistory(),
                this.getMaxPriorityFee(),
                new ApiClient().configs.getConfigs([keyGasLimitErc20])
            );

            const results = await Promise.all(rpcCalls);
            if (results[0] && results[1] && results[2]) {
                presets = {
                    low: {
                        maxFeePerGas: new BigNumber(results[1]).plus(results[2]),
                        maxPriorityFeePerGas: new BigNumber(results[2])
                    },

                    medium: {
                        maxFeePerGas: new BigNumber(results[1]).plus(results[2]).multipliedBy(1.5),
                        maxPriorityFeePerGas: new BigNumber(results[2]).multipliedBy(1.5)
                    },
                    high: {
                        maxFeePerGas: new BigNumber(results[1]).plus(results[2]).multipliedBy(2),
                        maxPriorityFeePerGas: new BigNumber(results[2]).multipliedBy(2)
                    }
                };
            }

            let gasLimit;

            const contractAddressStaking = await getContract(this.chainId, Contracts.STAKING);

            if (
                data.contractAddress &&
                data.contractAddress.toLowerCase() === contractAddressStaking.toLowerCase()
            ) {
                const resGasLimit = results[3];
                gasLimit =
                    resGasLimit && resGasLimit.result[keyGasLimitErc20]
                        ? new BigNumber(resGasLimit.result[keyGasLimitErc20])
                        : config.feeOptions.defaults.gasLimit[tokenType];
            } else {
                gasLimit =
                    results[0] && results[0].result
                        ? new BigNumber(parseInt(results[0].result, 16))
                        : config.feeOptions.defaults.gasLimit[tokenType];
            }

            return {
                maxFeePerGas:
                    presets.medium.maxFeePerGas.toString() ||
                    config.feeOptions.defaults.gasPricePresets.medium.maxFeePerGas.toString(),
                maxPriorityFeePerGas:
                    presets.medium.maxPriorityFeePerGas.toString() ||
                    config.feeOptions.defaults.gasPricePresets.medium.maxPriorityFeePerGas.toString(),
                gasLimit: gasLimit.toString(),
                presets: presets ? presets : config.feeOptions.defaults.gasPricePresets,
                feeTotal: new BigNumber(results[1])
                    .multipliedBy(2)
                    .multipliedBy(gasLimit)
                    .toString(),
                responseHasDefaults: presets ? false : true
            };
        } catch (error) {
            const maxFeePerGas = config.feeOptions.defaults.gasPricePresets.medium.maxFeePerGas;
            const gasLimit = config.feeOptions.defaults.gasLimit[tokenType];

            SentryAddBreadcrumb({
                message: JSON.stringify({
                    error
                })
            });
            SentryCaptureException(
                new Error(`Failed to get estimated eip 1559 fees - defaults Set, ${error?.message}`)
            );

            return {
                maxFeePerGas: maxFeePerGas.toString(),
                maxPriorityFeePerGas: config.feeOptions.defaults.gasPricePresets.medium.maxPriorityFeePerGas.toString(),
                gasLimit: gasLimit.toString(),
                presets: config.feeOptions.defaults.gasPricePresets,
                feeTotal: maxFeePerGas.multipliedBy(gasLimit).toString(),
                responseHasDefaults: true
            };
        }
    }

    private async estimateLegacyTransactions(
        transactionType: TransactionType,
        data: {
            from?: string;
            to?: string;
            amount?: string;
            contractAddress?: string;
            raw?: string;
        },
        tokenType: TokenType = TokenType.NATIVE
    ): Promise<IFeeOptions> {
        try {
            let results = {};
            switch (transactionType) {
                case TransactionType.TRANSFER: {
                    results = data.contractAddress
                        ? await this.estimateGas(
                              true,
                              data.from,
                              data.to,
                              data.contractAddress,
                              new BigNumber(data.amount),
                              '0x' +
                                  abi
                                      .simpleEncode(
                                          MethodSignature.TRANSFER,
                                          data.to,
                                          new BigNumber(data.amount).toFixed()
                                      )
                                      .toString('hex')
                          )
                        : await this.estimateGas(true, data.from, data.to);
                }
                case TransactionType.CONTRACT_CALL: {
                    results = await this.estimateGas(
                        true,
                        data.from,
                        data.to,
                        data.contractAddress,
                        new BigNumber(data.amount),
                        data.raw
                    );
                }
            }
            let presets: {
                low: {
                    gasPrice: BigNumber;
                };
                medium: {
                    gasPrice: BigNumber;
                };
                high: {
                    gasPrice: BigNumber;
                };
            };

            if (results[1]) {
                const response = results[1];

                // Need to divide by 10 the response from ethgasAPI.json
                // Note: To convert the provided values to gwei, divide by 10

                if (response && response.result) {
                    presets = {
                        low: {
                            gasPrice: Ethereum.account.convertUnit(
                                new BigNumber(response.result.data.average),
                                config.feeOptions.ui.gasPriceUnit,
                                config.defaultUnit
                            )
                        },
                        medium: {
                            gasPrice: Ethereum.account.convertUnit(
                                new BigNumber(response.result.data.fast),
                                config.feeOptions.ui.gasPriceUnit,
                                config.defaultUnit
                            )
                        },
                        high: {
                            gasPrice: Ethereum.account.convertUnit(
                                new BigNumber(response.result.data.fastest),
                                config.feeOptions.ui.gasPriceUnit,
                                config.defaultUnit
                            )
                        }
                    };
                } else {
                    SentryCaptureException(
                        new Error(`Failed to get estimated eip 1559 fees - defaults Set`)
                    );
                }
            }

            const contractAddressStaking = await getContract(this.chainId, Contracts.STAKING);

            const gasPrice = presets?.medium.gasPrice || config.feeOptions.defaults.gasPrice;
            let gasLimit =
                results[0] && results[0].result
                    ? new BigNumber(parseInt(results[0].result, 16))
                    : config.feeOptions.defaults.gasLimit[tokenType];

            // TODO - find a way to get the exact gaslimit for GRT staking
            if (
                data.contractAddress &&
                data.contractAddress.toLowerCase() === contractAddressStaking.toLowerCase()
            ) {
                const keyGasLimitErc20 = `ethereum.${this.chainId.toString()}.fees.gasLimit.erc20`;

                const resGasLimit = await new ApiClient().configs.getConfigs([keyGasLimitErc20]);

                gasLimit =
                    resGasLimit?.result && resGasLimit.result[keyGasLimitErc20]
                        ? new BigNumber(resGasLimit.result[keyGasLimitErc20])
                        : config.feeOptions.defaults.gasLimit[tokenType];
            }

            return {
                gasPrice: gasPrice.toString(),
                gasLimit: gasLimit.toString(),
                presets: presets ? presets : config.feeOptions.defaults.gasPricePresets,
                feeTotal: gasPrice.multipliedBy(gasLimit).toString(),
                responseHasDefaults: presets ? false : true
            };
        } catch (error) {
            const gasPrice = config.feeOptions.defaults.gasPrice;
            const gasLimit = config.feeOptions.defaults.gasLimit[tokenType];

            SentryAddBreadcrumb({
                message: JSON.stringify({
                    error
                })
            });
            SentryCaptureException(
                new Error(`Failed to get estimated - defaults Set, ${error?.message}`)
            );

            return {
                gasPrice: gasPrice.toString(),
                gasLimit: gasLimit.toString(),
                presets: config.feeOptions.defaults.gasPricePresets,
                feeTotal: gasPrice.multipliedBy(gasLimit).toString(),
                responseHasDefaults: true
            };
        }
    }

    public async estimateGas(
        fetchPrice: boolean,
        from: string,
        to: string,
        contractAddress?: string,
        amount?: BigNumber,
        data?: string
    ): Promise<any> {
        let gasEstimatePromise;
        if (contractAddress) {
            let params;

            params = {
                from,
                to: contractAddress
            };

            if (data) {
                params = {
                    ...params,
                    data
                };
            }

            gasEstimatePromise = this.http
                .jsonRpc('eth_estimateGas', [{ params }, 'latest'])
                .then(res => {
                    if (res.result) {
                        res.result =
                            '0x' + new BigNumber(res.result, 16).multipliedBy(1.3).toString(16);
                        return res;
                    }
                });
        } else {
            gasEstimatePromise = this.http.jsonRpc('eth_estimateGas', [{ from, to }]);
        }

        const calls = [gasEstimatePromise];
        if (fetchPrice)
            calls.push(
                new HttpClient(CONFIG.walletApiBaseUrl).get('/blockchain/ethereum/gas-prices')
            );

        return Promise.all(calls);
    }

    public async getMinimumAmountDelegate(): Promise<BigNumber> {
        return new BigNumber(0);
    }
}
