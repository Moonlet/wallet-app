import { config } from './config';
import { networks } from './networks';
import { Client } from './client';
import { CeloTransactionUtils } from './transaction';
import { CeloAccountUtils } from './account';
import { IBlockchain, ChainIdType } from '../types';
import { Stats } from './stats';

const account = new CeloAccountUtils();
const transaction = new CeloTransactionUtils();
const clients = {};

export const Celo: IBlockchain = {
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
