import { BlockchainGenericClient } from '../types';
import { BigNumber } from 'bignumber.js';
import { networks } from './networks';
import { fromBech32Address } from '@zilliqa-js/crypto/dist/bech32';

export class Client extends BlockchainGenericClient {
    constructor(chainId: number) {
        super(chainId, networks);
    }

    public getBalance(address: string): Promise<BigNumber> {
        return this.rpc
            .call('GetBalance', [
                fromBech32Address(address)
                    .replace('0x', '')
                    .toLowerCase()
            ])
            .catch(error => {
                if (error.message === 'Account is not created') {
                    return Promise.resolve(0);
                }
                return Promise.reject(error);
            });
    }

    public getNonce(address: string): Promise<number> {
        throw new Error('Method not implemented.');
    }
}
