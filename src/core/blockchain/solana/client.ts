import {
    BlockchainGenericClient,
    ChainIdType,
    IBalance,
    IBlockInfo,
    TransactionMessageText,
    TransactionType
} from '../types';
import { BigNumber } from 'bignumber.js';
import { networks } from './networks';
import { config } from './config';
import { NameService } from './name-service';
import { TokenType } from '../types/token';
import { ClientUtils } from './client-utils';

export class Client extends BlockchainGenericClient {
    constructor(chainId: ChainIdType) {
        super(chainId, networks);

        this.nameService = new NameService(this);
        this.utils = new ClientUtils(this);
    }

    public async getBalance(address: string): Promise<IBalance> {
        return this.http.jsonRpc('getBalance', [address]).then(res => {
            return {
                total: new BigNumber(res.result?.value),
                available: new BigNumber(res.result?.value)
            };
        });
    }

    public async getNonce(address: string): Promise<number> {
        try {
            return 1; // TODO to see what happens when there are multiple transactions in a limited time
        } catch (result) {
            return Promise.reject(result);
        }
    }

    public async getCurrentBlock(): Promise<IBlockInfo> {
        try {
            return {
                hash: '',
                number: 1
            };
        } catch (result) {
            return Promise.reject(result);
        }
    }

    public sendTransaction(transaction): Promise<string> {
        return this.http.jsonRpc('CreateTransaction', [transaction]).then(res => {
            if (res.result) {
                return res.result.TranID;
            }

            const errorMessage: string = res.error.message;
            if (errorMessage.includes('transaction underpriced')) {
                return Promise.reject(TransactionMessageText.TR_UNDERPRICED);
            }
            if (errorMessage.includes("Contract account won't accept normal txn")) {
                return Promise.reject(TransactionMessageText.CONTRACT_TX_NORMAL_NOT_ALLOWED);
            }
        });
    }

    public async calculateFees(
        from: string,
        to: string,
        amount?,
        contractAddress?,
        tokenType: TokenType = TokenType.NATIVE
    ) {
        const gasLimit = config.feeOptions.defaults.gasLimit[tokenType];

        try {
            const result = await this.estimateFees();

            const gasPrice = result.result
                ? new BigNumber(Number(result.result))
                : config.feeOptions.defaults.gasPrice;

            return {
                gasPrice: gasPrice.toString(),
                gasLimit: gasLimit.toString(),
                feeTotal: gasPrice.multipliedBy(gasLimit).toString()
            };
        } catch {
            const gasPrice = config.feeOptions.defaults.gasPrice;
            return {
                gasPrice: gasPrice.toString(),
                gasLimit: gasLimit.toString(),
                feeTotal: gasPrice.multipliedBy(gasLimit).toString()
            };
        }
    }

    private async estimateFees(): Promise<any> {
        return 0;
        //  return this.http.jsonRpc('GetMinimumGasPrice', []);
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

    public async getMinimumAmountDelegate(): Promise<BigNumber> {
        return new BigNumber(0);
    }
}
