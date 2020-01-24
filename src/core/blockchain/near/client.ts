import { BlockchainGenericClient } from '../types';
import { BigNumber } from 'bignumber.js';
import { networks } from './networks';

export class Client extends BlockchainGenericClient {
    constructor(chainId: number) {
        super(chainId, networks);
    }

    public async getBalance(address: string): Promise<BigNumber> {
        throw new Error('Not Implemented');
    }

    public async getNonce(address: string): Promise<number> {
        throw new Error('Not Implemented');
    }

    public sendTransaction(transaction): Promise<string> {
        throw new Error('Not Implemented');
    }

    public async calculateFees(from: string, to: string) {
        throw new Error('Not Implemented');
    }
}
