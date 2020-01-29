import { BlockchainGenericClient, IFeeOptions, ChainIdType } from '../types';
import { BigNumber } from 'bignumber.js';
import { networks } from './networks';
import { fromBech32Address } from '@zilliqa-js/crypto/dist/bech32';
import { config } from './config';

export class Client extends BlockchainGenericClient {
    constructor(chainId: ChainIdType) {
        super(chainId, networks);
    }

    public async getBalance(address: string): Promise<BigNumber> {
        try {
            const response = await this.call('GetBalance', [
                fromBech32Address(address)
                    .replace('0x', '')
                    .toLowerCase()
            ]);
            return new BigNumber(response.result.balance);
        } catch (result) {
            if (result?.error?.message === 'Account is not created') {
                return Promise.resolve(new BigNumber(0));
            }
            return Promise.reject(result);
        }
    }

    public async getNonce(address: string): Promise<number> {
        try {
            const response = await this.call('GetBalance', [
                fromBech32Address(address)
                    .replace('0x', '')
                    .toLowerCase()
            ]);
            return response.result.nonce + 1; // TODO to see what happens when there are multiple transactions in a limited time
        } catch (result) {
            if (result?.error?.message === 'Account is not created') {
                return 0;
            }
            return Promise.reject(result);
        }
    }

    public sendTransaction(transaction): Promise<string> {
        return this.rpc.call('CreateTransaction', [transaction]).then(res => res.result.TranID);
    }

    public async call(method: string, params: any[]): Promise<any> {
        try {
            const result = await this.rpc.call(method, params);
            if (result.error) {
                return Promise.reject(result);
            }
            return result;
        } catch (e) {
            return Promise.reject(e);
        }
    }

    public async calculateFees(from: string, to: string) {
        const result = await this.estimateFees();

        const gasPrice = result.result
            ? new BigNumber(Number(result.result))
            : config.feeOptions.defaults.gasPrice;
        const gasLimit = config.feeOptions.defaults.gasLimit;

        const feeOptions: IFeeOptions = {
            gasPrice: gasPrice.toString(),
            gasLimit: gasLimit.toString(),
            feeTotal: gasPrice.multipliedBy(gasLimit).toString()
        };

        return feeOptions;
    }

    private async estimateFees(): Promise<any> {
        return this.rpc.call('GetMinimumGasPrice', []);
    }
}
