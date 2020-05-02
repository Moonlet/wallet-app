import { Client as EthereumClient } from '../ethereum/client';
import { Erc20Client } from './tokens/erc20-client';
import { ChainIdType, TransactionMessageText } from '../types';
import { TokenType } from '../types/token';
import { ClientUtils } from './client-utils';
import { networks } from './networks';
import { HttpClient } from '../../utils/http-client';
import { NameService } from './name-service';
import BigNumber from 'bignumber.js';
import { config } from './config';
import abi from 'ethereumjs-abi';

export class Client extends EthereumClient {
    constructor(chainId: ChainIdType) {
        super(chainId);
        this.tokens[TokenType.ERC20] = new Erc20Client(this);
        this.nameService = new NameService();
        this.utils = new ClientUtils(this);

        let url = networks[0].url;
        const network = networks.filter(n => n.chainId === chainId)[0];
        if (network) {
            url = network.url;
        }
        this.http = new HttpClient(url);
    }

    public sendTransaction(transaction): Promise<string> {
        return this.http.jsonRpc('eth_sendRawTransaction', [transaction]).then(res => {
            //            console.log('res', res);
            if (res.result) {
                return res.result;
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

    public async calculateFees(
        from: string,
        to: string,
        amount: BigNumber = new BigNumber(1),
        contractAddress?: string,
        tokenType: TokenType = TokenType.NATIVE
    ) {
        try {
            const results = contractAddress
                ? await this.estimateGas(from, to, amount, contractAddress)
                : await this.estimateGas(from, to);

            const gasPriceRpc = await this.getGasPrice();

            const gasPrice = gasPriceRpc ? gasPriceRpc : config.feeOptions.defaults.gasPrice;
            const gasLimit = results[0].result
                ? new BigNumber(parseInt(results[0].result, 16)).multipliedBy(1.5)
                : config.feeOptions.defaults.gasLimit[tokenType];

            //        console.log('gasPrice, gaslimit', gasPrice, gasLimit);

            return {
                gasPrice: gasPrice.toString(),
                gasLimit: gasLimit.toString(),
                presets: {},
                feeTotal: gasPrice.multipliedBy(gasLimit).toString()
            };
        } catch {
            const gasPrice = config.feeOptions.defaults.gasPrice;
            const gasLimit = config.feeOptions.defaults.gasLimit[tokenType];

            return {
                gasPrice: gasPrice.toString(),
                gasLimit: gasLimit.toString(),
                presets: {},
                feeTotal: gasPrice.multipliedBy(gasLimit).toString()
            };
        }
    }

    public async getGasPrice(): Promise<BigNumber> {
        return this.http.jsonRpc('eth_gasPrice', []).then(res => {
            //       console.log('gas', res.result);
            return new BigNumber(res.result, 16);
        });
    }

    public async estimateGas(
        from: string,
        to: string,
        amount?: BigNumber,
        contractAddress?: string
    ): Promise<any> {
        let gasEstimatePromise;
        if (contractAddress) {
            gasEstimatePromise = this.http.jsonRpc('eth_estimateGas', [
                {
                    from,
                    to: contractAddress,
                    data:
                        '0x' +
                        abi
                            .simpleEncode('transfer(address,uint256)', to, amount.toString())
                            .toString('hex')
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
