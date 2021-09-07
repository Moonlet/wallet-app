import { Client as EthereumClient } from '../ethereum/client';
import { Erc20Client } from './tokens/erc20-client';
import {
    ChainIdType,
    TransactionMessageText,
    TransactionType,
    Contracts,
    TypedTransaction
} from '../types';
import { TokenType } from '../types/token';
import { ClientUtils } from './client-utils';
import { networks } from './networks';
import { HttpClient } from '../../utils/http-client';
import { NameService } from './name-service';
import BigNumber from 'bignumber.js';
import { config } from './config';
import { LockedGold } from './contracts/lockedgold';
import { Election } from './contracts/election';
import { Accounts } from './contracts/accounts';
import abi from 'ethereumjs-abi';
import { captureException as SentryCaptureException } from '@sentry/react-native';

export class Client extends EthereumClient {
    constructor(chainId: ChainIdType) {
        super(chainId);
        this.tokens[TokenType.ERC20] = new Erc20Client(this);
        this.nameService = new NameService(this);
        this.utils = new ClientUtils(this);
        this.contracts[Contracts.LOCKED_GOLD] = new LockedGold(this);
        this.contracts[Contracts.ELECTION] = new Election(this);
        this.contracts[Contracts.ACCOUNTS] = new Accounts(this);

        let url = networks[0].url;
        const network = networks.filter(n => n.chainId === chainId)[0];
        if (network) {
            url = network.url;
        }
        this.http = new HttpClient(url);
    }

    public sendTransaction(transaction): Promise<{ txHash: string; rawResponse: any }> {
        return this.http.jsonRpc('eth_sendRawTransaction', [transaction]).then(res => {
            if (res.result) {
                return {
                    txHash: res.result,
                    rawResponse: res
                };
            } else {
                SentryCaptureException(new Error(JSON.stringify(res || 'no result from rpc')));
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

    public async getFees(
        transactionType: TransactionType,

        data: {
            from?: string;
            to?: string;
            amount?: string;
            contractAddress?: string;
            raw?: string;
        },
        typedTransaction: TypedTransaction = TypedTransaction.TYPE_0,
        tokenType: TokenType = TokenType.NATIVE
    ) {
        try {
            let results = {};

            const transferRawData =
                '0x' +
                abi
                    .simpleEncode(
                        'transfer(address,uint256)',
                        data.to,
                        new BigNumber(data.amount).toFixed()
                    )
                    .toString('hex');

            switch (transactionType) {
                case TransactionType.TRANSFER: {
                    results = data.contractAddress
                        ? await this.estimateGas(
                              true,
                              data.from,
                              data.to,
                              data.contractAddress,
                              new BigNumber(data.amount),
                              transferRawData
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
                        data.raw ? data.raw : transferRawData
                    );
                }
            }

            const gasPriceRpc = await this.getGasPrice();

            const gasPrice = gasPriceRpc
                ? gasPriceRpc.multipliedBy(1.5)
                : config.feeOptions.defaults.gasPrice;
            const gasLimit = results[0].result
                ? new BigNumber(parseInt(results[0].result, 16)).multipliedBy(1.5)
                : config.feeOptions.defaults.gasLimit[tokenType];

            return {
                gasPrice: gasPrice.toFixed(0),
                gasLimit: gasLimit.toFixed(0),
                presets: {},
                feeTotal: gasPrice.multipliedBy(gasLimit).toFixed()
            };
        } catch {
            const gasPrice = config.feeOptions.defaults.gasPrice;
            const gasLimit = config.feeOptions.defaults.gasLimit[tokenType];

            return {
                gasPrice: gasPrice.toFixed(),
                gasLimit: gasLimit.toFixed(),
                presets: {},
                feeTotal: gasPrice.multipliedBy(gasLimit).toFixed()
            };
        }
    }

    public async getMinimumAmountDelegate(): Promise<BigNumber> {
        return new BigNumber(0);
    }

    public async getGasPrice(): Promise<BigNumber> {
        return this.http.jsonRpc('eth_gasPrice', []).then(res => {
            return new BigNumber(res.result, 16);
        });
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
        if (data) {
            gasEstimatePromise = this.http.jsonRpc('eth_estimateGas', [
                {
                    from,
                    to: contractAddress,
                    data
                }
            ]);
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
