import { config } from './config';
import { networks } from './networks';
import { Client } from './client';
import * as transaction from './transaction';
import * as account from './account';
import { IBlockchain } from '../types';

export interface IZilliqaTxOptions {
    nonce?: number;
    chainId: number;
    gasPrice?: number;
    gasLimit?: number;
    data?: string;
    code?: string;
    publicKey?: string;
}

export const Zilliqa: IBlockchain<IZilliqaTxOptions> = {
    config,
    networks,
    transaction,
    account,
    Client,
    getClient: (chainId: number) => new Client(chainId)
};
