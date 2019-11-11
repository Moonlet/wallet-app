import { config } from './config';
import { networks } from './networks';
import { Client } from './client';
import * as transaction from './transaction';
import * as account from './account';
import { IBlockchain } from '../types';

export const Zilliqa: IBlockchain = {
    config,
    networks,
    transaction,
    account,
    Client,
    getClient: (chainId: number) => new Client(chainId)
};
