import { BlockchainGenericClient } from '../types';
import { networks } from './networks';
import { BigNumber } from 'bignumber.js';

export class Client extends BlockchainGenericClient {
    constructor(chainId: number) {
        super(chainId, networks);
    }

    public getBalance(address: string): Promise<BigNumber> {
        return this.rpc.call('eth_getBalance', [address, 'latest']).then(res => {
            return new BigNumber(res.result, 16);
        });
    }

    public getNonce(address: string): Promise<number> {
        throw new Error('Method not implemented.');
    }
}
