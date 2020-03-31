import {
    BlockchainGenericClient,
    ChainIdType,
    IBlockInfo,
    TransactionMessageText,
    IBlockchainTransaction,
    Blockchain,
    TransactionType
} from '../types';
import { networks } from './networks';
import { BigNumber } from 'bignumber.js';
import { config } from './config';
import { convertUnit } from '../ethereum/account';
import abi from 'ethereumjs-abi';
import { Erc20Client } from './tokens/erc20-client';
import { TokenType, TokenScreenComponentType } from '../types/token';
import { NameService } from './name-service';
import { getTransactionStatusByCode } from './transaction';
import { generateAccountTokenState } from '../../../redux/tokens/static-selectors';

const inputRegex = /^(\w{10})(\w{24})(\w{40})(\w{64})$/;

export class Client extends BlockchainGenericClient {
    constructor(chainId: ChainIdType) {
        super(chainId, networks);
        this.tokens[TokenType.ERC20] = new Erc20Client(this);
        this.nameService = new NameService();
    }

    public getBalance(address: string): Promise<BigNumber> {
        return this.http
            .jsonRpc('eth_getBalance', [this.fixAddress(address), 'latest'])
            .then(res => {
                return new BigNumber(res.result, 16);
            });
    }

    public getNonce(address: string): Promise<number> {
        return this.http
            .jsonRpc('eth_getTransactionCount', [this.fixAddress(address), 'latest'])
            .then(res => {
                return new BigNumber(res.result, 16).toNumber();
            });
    }

    public sendTransaction(transaction): Promise<string> {
        return this.http.jsonRpc('eth_sendRawTransaction', [transaction]).then(res => {
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

    public async calculateFees(
        from: string,
        to: string,
        amount: BigNumber = new BigNumber(1),
        contractAddress?: string,
        tokenType: TokenType = TokenType.NATIVE
    ) {
        const results = contractAddress
            ? await this.estimateFees(from, to, amount, contractAddress)
            : await this.estimateFees(from, to);

        let presets: {
            cheap: BigNumber;
            standard: BigNumber;
            fast: BigNumber;
            fastest: BigNumber;
        };
        if (results[1]) {
            const response = await results[1].json();

            presets = {
                cheap: convertUnit(
                    new BigNumber(response.safeLow),
                    config.feeOptions.ui.gasPriceUnit,
                    config.defaultUnit
                ),
                standard: convertUnit(
                    new BigNumber(response.average),
                    config.feeOptions.ui.gasPriceUnit,
                    config.defaultUnit
                ),
                fast: convertUnit(
                    new BigNumber(response.fast),
                    config.feeOptions.ui.gasPriceUnit,
                    config.defaultUnit
                ),
                fastest: convertUnit(
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
    }

    public getTransactionInfo(transactionHash): Promise<IBlockchainTransaction<any>> {
        const rpcCalls = [
            this.http.jsonRpc('eth_getTransactionByHash', transactionHash),
            this.http.jsonRpc('eth_getTransactionReceipt', transactionHash)
        ];

        return Promise.all(rpcCalls).then(async res => {
            try {
                if (!res[0].result) {
                    throw new Error(
                        res[0].error.message ||
                            `Error getting transaction info for ${transactionHash}`
                    );
                }
                if (!res[1].result) {
                    throw new Error(
                        res[1].error.message ||
                            `Error getting transaction receipt for ${transactionHash}`
                    );
                }

                const txInfo = res[0].result;
                const txReceipt = res[1].result;
                let token = config.tokens.ETH;
                const data: any = {};

                const tokenInfo = await this.getTokenTransferInfo(txInfo);
                if (tokenInfo) {
                    token = tokenInfo.token;
                    txInfo.to = tokenInfo.address;

                    data.params = [txInfo.to, tokenInfo.amount];
                }

                return {
                    id: transactionHash,
                    date: {
                        created: Date.now(),
                        signed: Date.now(),
                        broadcasted: Date.now(),
                        confirmed: Date.now()
                    },
                    blockchain: Blockchain.ETHEREUM,
                    chainId: this.chainId,
                    type: TransactionType.TRANSFER,

                    address: txInfo.from,
                    publicKey: '', // TODO: get publicKey form vrs

                    toAddress: txInfo.to,
                    amount: txInfo.value,
                    data,
                    feeOptions: {
                        gasPrice: txInfo.gasPrice,
                        gasLimit: txInfo.gas,
                        feeTotal: txReceipt.gasUsed
                    },
                    broadcatedOnBlock: txInfo.blockNumber,
                    nonce: txInfo.nonce,
                    status: getTransactionStatusByCode(txReceipt.status),
                    token: generateAccountTokenState(token)
                };
            } catch (error) {
                return Promise.reject(error.message);
            }
        });
    }

    async getTokenTransferInfo(txInfo: any) {
        if (!txInfo.input) {
            return false;
        }

        const parts = txInfo.input.match(inputRegex);

        if (parts.length === 5 && parts[1] === '0xa9059cbb') {
            const token = await this.tokens[TokenType.ERC20].getTokenInfo(txInfo.to);
            token.type = TokenType.ERC20;
            token.ui = {
                decimals: token.decimals,
                tokenScreenComponent: TokenScreenComponentType.DEFAULT
            };
            return {
                address: '0x' + parts[3],
                amount: '0x' + parts[4],
                token
            };
        }

        return false;
    }

    private async estimateFees(
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

    private fixAddress(address: string): string {
        if (address.indexOf('0x') < 0) {
            address = '0x' + address;
        }
        return address;
    }
}
