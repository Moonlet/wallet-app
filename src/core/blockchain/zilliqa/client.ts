import { IBlockchainClient } from '../types';
import { BigNumber } from 'bignumber.js';

export class Client implements IBlockchainClient {
    constructor(public chainId: number) {}

    public getBalance(address: string): Promise<BigNumber> {
        throw new Error('Method not implemented.');
    }
}
