import { config } from './config';
import { networks } from './networks';
import { Client } from './client';
import { CosmosTransactionUtils } from './transaction';
import { CosmosAccountUtils } from './account';

import { IBlockchain, ChainIdType } from '../types';
import { Stats } from './stats';

const account = new CosmosAccountUtils();
const transaction = new CosmosTransactionUtils();
const clients = {};

export const Cosmos: IBlockchain = {
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
