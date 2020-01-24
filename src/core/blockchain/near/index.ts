import { config } from './config';
import { networks } from './networks';
import { Client } from './client';
import * as transaction from './transaction';
import * as account from './account';
import { IBlockchain } from '../types';

// this is in refactoring proccess...
export interface INearTxOptions {
    nonce?: number;
    chainId: number;
    gasPrice?: number;
    gasLimit?: number;
    data?: string;
    code?: string;
    publicKey?: string;
}

// this is in refactoring proccess...
export const Near: IBlockchain<INearTxOptions> = {
    config,
    networks,
    transaction,
    account,
    Client,
    getClient: (chainId: number) => new Client(chainId)
};
