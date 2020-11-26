import {
    BlockchainGenericClient,
    ChainIdType,
    IBalance,
    IBlockInfo,
    TransactionType
} from '../types';
import { BigNumber } from 'bignumber.js';
import { networks } from './networks';
import { config, Contracts } from './config';
import { NameService } from './name-service';
import { TokenType } from '../types/token';
import { ClientUtils } from './client-utils';
import { Connection } from '@solana/web3.js/src/connection';
import { Staking } from './contracts/staking';

export class Client extends BlockchainGenericClient {
    private connection;
    constructor(chainId: ChainIdType) {
        super(chainId, networks);

        this.nameService = new NameService(this);
        this.utils = new ClientUtils(this);
        this.connection = new Connection(this.network.url);
        this.contracts[Contracts.STAKING] = new Staking(this);
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
        return 1;
    }

    public async getCurrentBlock(): Promise<IBlockInfo> {
        return this.http.jsonRpc('getSlot', []).then(res => {
            return res.result;
        });
    }

    public async getCurrentBlockHash(): Promise<string> {
        return this.http.jsonRpc('getRecentBlockhash', []).then(res => {
            return res.result.value.blockhash;
        });
    }

    public sendTransaction(transaction): Promise<string> {
        return this.connection.sendRawTransaction(transaction).then(res => {
            if (res) {
                return res;
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
