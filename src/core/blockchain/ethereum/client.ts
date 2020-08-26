import {
    BlockchainGenericClient,
    ChainIdType,
    IBlockInfo,
    TransactionMessageText,
    TransactionType
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

export class Client extends BlockchainGenericClient {
    constructor(chainId: ChainIdType) {
        super(chainId, networks);
        this.tokens[TokenType.ERC20] = new Erc20Client(this);
        this.nameService = new NameService();
        this.utils = new ClientUtils(this);
    }

    public getBalance(address: string): Promise<BigNumber> {
        return this.http.jsonRpc('eth_getBalance', [fixEthAddress(address), 'latest']).then(res => {
            return new BigNumber(res.result, 16);
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
        tokenType: TokenType = TokenType.NATIVE
    ) {
        try {
            let results = {};

            switch (transactionType) {
                case TransactionType.TRANSFER: {
                    results = data.contractAddress
                        ? await this.estimateGas(
                              data.from,
                              data.to,
                              data.contractAddress,
                              new BigNumber(data.amount),
                              '0x' +
                                  abi
                                      .simpleEncode(
                                          'transfer(address,uint256)',
                                          data.to,
                                          new BigNumber(data.amount).toFixed()
                                      )
                                      .toString('hex')
                          )
                        : await this.estimateGas(data.from, data.to);
                }
            }
            let presets: {
                cheap: BigNumber;
                standard: BigNumber;
                fast: BigNumber;
                fastest: BigNumber;
            };
            if (results[1]) {
                const response = await results[1].json();

                presets = {
                    cheap: Ethereum.account.convertUnit(
                        new BigNumber(response.safeLow),
                        config.feeOptions.ui.gasPriceUnit,
                        config.defaultUnit
                    ),
                    standard: Ethereum.account.convertUnit(
                        new BigNumber(response.average),
                        config.feeOptions.ui.gasPriceUnit,
                        config.defaultUnit
                    ),
                    fast: Ethereum.account.convertUnit(
                        new BigNumber(response.fast),
                        config.feeOptions.ui.gasPriceUnit,
                        config.defaultUnit
                    ),
                    fastest: Ethereum.account.convertUnit(
                        new BigNumber(response.fastest),
                        config.feeOptions.ui.gasPriceUnit,
                        config.defaultUnit
                    )
                };
            }

            const gasPrice = presets?.standard || config.feeOptions.defaults.gasPrice;
            const gasLimit = results[0].result
                ? new BigNumber(parseInt(results[0].result, 16))
                : config.feeOptions.defaults.gasLimit[tokenType];

            return {
                gasPrice: gasPrice.toString(),
                gasLimit: gasLimit.toString(),
                presets: presets ? presets : config.feeOptions.defaults.gasPricePresets,
                feeTotal: gasPrice.multipliedBy(gasLimit).toString()
            };
        } catch {
            const gasPrice = config.feeOptions.defaults.gasPrice;
            const gasLimit = config.feeOptions.defaults.gasLimit[tokenType];

            return {
                gasPrice: gasPrice.toString(),
                gasLimit: gasLimit.toString(),
                presets: config.feeOptions.defaults.gasPricePresets,
                feeTotal: gasPrice.multipliedBy(gasLimit).toString()
            };
        }
    }

    public async estimateGas(
        from: string,
        to: string,
        contractAddress?: string,
        amount?: BigNumber,
        data?: string
    ): Promise<any> {
        let gasEstimatePromise;
        if (contractAddress) {
            gasEstimatePromise = this.http
                .jsonRpc('eth_estimateGas', [
                    {
                        from,
                        to: contractAddress,
                        data
                    }
                ])
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

        return Promise.all([
            gasEstimatePromise,
            // TODO: extract url in a constant, also create a firebase function to be sure that this service is up
            fetch('https://ethgasstation.info/json/ethgasAPI.json')
        ]);
    }
}
