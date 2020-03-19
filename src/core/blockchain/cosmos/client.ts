import { BlockchainGenericClient, ChainIdType, IBlockInfo } from '../types';
import { BigNumber } from 'bignumber.js';
import { networks } from './networks';
import { config } from './config';
import { NameService } from './name-service';

export class Client extends BlockchainGenericClient {
    constructor(chainId: ChainIdType) {
        super(chainId, networks);
        this.nameService = new NameService();
    }

    public getTransactionInfo(
        transactionHash: string
    ): Promise<import('../types').IBlockchainTransaction<any>> {
        throw new Error('Method not implemented.');
    }

    public async getBalance(address: string): Promise<BigNumber> {
        try {
            const symbolMap = config.tokens[config.coin].symbolMap;
            let denom = config.defaultUnit.toLowerCase();
            if (symbolMap !== undefined) {
                Object.keys(symbolMap).map(key => {
                    if (key === this.chainId) {
                        denom = symbolMap[key];
                    }
                });
            }
            const res = await this.http.get('/bank/balances/' + address);
            if (res.result) {
                return new BigNumber(res.result.filter(i => i.denom === denom)[0]?.amount);
            }
        } catch {
            return new BigNumber(0);
        }
    }

    public async getAccountInfo(
        address: string
    ): Promise<{ account_number: string; sequence: number }> {
        try {
            const res = await this.http.get('/auth/accounts/' + address);
            if (res.result) {
                return {
                    account_number: res.result.value.account_number,
                    sequence: res.result.value.sequence
                };
            }
        } catch {
            return Promise.reject();
        }
    }

    public async getNonce(address: string): Promise<number> {
        try {
            const res = await this.http.get('/auth/accounts/' + address);
            return res.result.sequence;
        } catch {
            return 0;
        }
    }

    public async getCurrentBlock(): Promise<IBlockInfo> {
        try {
            const response = await this.http.get('/blocks/latest');
            return {
                hash: response?.block_meta?.block_id?.hash,
                number: response?.block_meta?.header?.height
            };
        } catch (result) {
            return Promise.reject(result);
        }
    }

    public sendTransaction(transaction): Promise<string> {
        return this.http.post('/txs', transaction).then(res => {
            if (res.code === undefined) {
                return res.txhash;
            } else {
                return Promise.reject('COSMOS_ERROR_' + res.code);
            }
        });
    }

    public async calculateFees(from: string, to: string) {
        const gasPrice =
            config.feeOptions.defaults.gasPricePresets.low || config.feeOptions.defaults.gasPrice;
        const gasLimit = config.feeOptions.defaults.gasLimit.toFixed();
        const feeTotal = gasPrice.multipliedBy(new BigNumber(gasLimit)).toFixed();

        return {
            gasPrice: gasPrice.toFixed(),
            gasLimit,
            presets: config.feeOptions.defaults.gasPricePresets,
            feeTotal
        };
    }
}
