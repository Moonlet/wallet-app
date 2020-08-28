import { config } from './config';
import { networks } from './networks';
import { Client } from './client';
import { NearTransactionUtils } from './transaction';
import { NearAccountUtils } from './account';
import { IBlockchain, ChainIdType } from '../types';
import { Stats } from './stats';

const account = new NearAccountUtils();
const transaction = new NearTransactionUtils();
const clients = {};

export const Near: IBlockchain = {
    config,
    networks,
    transaction,
    account,
    Client,
    getStats: (chainId: ChainIdType) => new Stats(new Client(chainId), config),
    getClient: (chainId: ChainIdType) => {
        if (!clients[chainId]) {
            clients[chainId] = new Client(chainId);
        }
        return clients[chainId];
    }
};
