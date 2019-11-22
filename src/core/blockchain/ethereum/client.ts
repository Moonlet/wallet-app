import { BlockchainGenericClient } from '../types';
import { networks } from './networks';
import { BigNumber } from 'bignumber.js';
import { config } from './config';

export class Client extends BlockchainGenericClient {
    constructor(chainId: number) {
        super(chainId, networks);
    }

    public getBalance(address: string): Promise<BigNumber> {
        return this.rpc.call('eth_getBalance', [this.fixAddress(address), 'latest']).then(res => {
            return new BigNumber(res.result, 16);
        });
    }

    public getNonce(address: string): Promise<number> {
        return this.rpc
            .call('eth_getTransactionCount', [this.fixAddress(address), 'latest'])
            .then(res => {
                return new BigNumber(res.result, 16).toNumber();
            });
    }

    public sendTransaction(transaction): Promise<string> {
        return this.rpc.call('eth_sendRawTransaction', [transaction]).then(res => res.result);
    }

    public estimateFees(): { gasPrice: BigNumber; gasLimit: BigNumber } {
        return {
            gasPrice: config.feeOptions.defaults.gasPrice,
            gasLimit: config.feeOptions.defaults.gasLimit
        };
    }

    private fixAddress(address: string): string {
        if (address.indexOf('0x') < 0) {
            address = '0x' + address;
        }
        return address;
    }
}
