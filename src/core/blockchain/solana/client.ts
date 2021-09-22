import {
    Blockchain,
    BlockchainGenericClient,
    ChainIdType,
    Contracts,
    ISolanaBalance,
    IBlockInfo,
    ITransactionFees,
    TransactionType,
    TypedTransaction
} from '../types';
import { BigNumber } from 'bignumber.js';
import { networks } from './networks';
import { config } from './config';
import { NameService } from './name-service';
import { TokenType } from '../types/token';
import { ClientUtils } from './client-utils';
import { Connection } from '@solana/web3.js/src/connection';
import { Staking } from './contracts/staking';
import { ApiClient } from '../../utils/api-client/api-client';
import { SplClient } from './tokens/spl-client';

export class Client extends BlockchainGenericClient {
    private connection: Connection;

    constructor(chainId: ChainIdType) {
        super(chainId, networks);

        this.nameService = new NameService(this);
        this.utils = new ClientUtils(this);
        this.connection = new Connection(this.network.url);
        this.contracts[Contracts.STAKING] = new Staking(this);
        this.tokens[TokenType.SPL] = new SplClient(this);
    }

    public async getBalance(address: string): Promise<ISolanaBalance> {
        let balance: ISolanaBalance = {
            total: new BigNumber(0),
            available: new BigNumber(0),
            staked: new BigNumber(0),
            unstaked: new BigNumber(0),
            deactivating: new BigNumber(0),
            activating: new BigNumber(0),
            reward: new BigNumber(0),
            detailed: {}
        };

        try {
            const data = await new ApiClient().validators.getBalance(
                address,
                Blockchain.SOLANA,
                this.chainId.toString()
            );

            balance = {
                total: data?.balance?.total || balance.total,
                available: data?.balance?.available || balance.available,
                staked: data?.balance?.staked || balance.staked,
                unstaked: data?.balance?.unstaked || balance.unstaked,
                deactivating: data?.balance?.deactivating || balance.deactivating,
                activating: data?.balance?.activating || balance.activating,
                reward: data?.balance?.reward || balance.reward,
                detailed: data?.balance?.detailed || balance.detailed
            };
        } catch {
            // no need to handle this
        }

        return balance;
    }

    public async getTransactionFees(txHash: string): Promise<ITransactionFees> {
        try {
            // TODO: migrate to `getTransaction` before mainnet update to 1.8
            const confirmedTxRes = await this.http.jsonRpc('getConfirmedTransaction', [
                txHash,
                'json'
            ]);

            if (confirmedTxRes?.result?.meta?.fee) {
                return {
                    gasPrice: '0',
                    gasLimit: '0',
                    gasUsed: '0',
                    feeTotal: confirmedTxRes?.result?.meta?.fee
                };
            } else {
                return;
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    public async getNonce(address: string): Promise<number> {
        return 1;
    }

    public async getCurrentBlock(): Promise<IBlockInfo> {
        return this.http.jsonRpc('getSlot', []).then(res => {
            return {
                hash: res.result,
                number: res.result
            };
        });
    }

    public async getCurrentBlockHash(): Promise<string> {
        return this.http.jsonRpc('getRecentBlockhash', [{ commitment: 'finalized' }]).then(res => {
            return res?.result?.value?.blockhash;
        });
    }

    public async sendTransaction(transaction): Promise<{ txHash: string; rawResponse: any }> {
        try {
            const res = await this.connection.sendRawTransaction(transaction);
            if (res) {
                return {
                    txHash: res,
                    rawResponse: res
                };
            } else {
                throw new Error(res);
            }
        } catch (error) {
            throw new Error(error);
        }
    }

    public async getTransactionConfirmations(
        txsHash: string
    ): Promise<{
        confirmations: number;
    }> {
        const response = await this.http.jsonRpc('getSignatureStatuses', [
            [txsHash],
            { searchTransactionHistory: true }
        ]);

        let confirmations = 0;

        if (response?.result?.value[0]?.confirmations) {
            confirmations = response.result.value[0].confirmations;
        }

        // this means confirmations has reached max
        if (response?.result?.value && response?.result?.value[0]?.confirmations === null) {
            confirmations = null;
        }

        return { confirmations };
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
        typedTransaction: TypedTransaction = TypedTransaction.TYPE_0,
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

    public async isActiveToken(
        contractAddress: string,
        accountAddress: string,
        tokenType: TokenType
    ) {
        return this.tokens[tokenType].isActive(contractAddress, accountAddress);
    }
}
