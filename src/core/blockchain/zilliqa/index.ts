import { config } from './config';
import { networks } from './networks';
import { Client } from './client';
import { ZilliqaAccountUtils } from './account';
import { ZilliqaTransactionUtils } from './transaction';
import { IBlockchain, ChainIdType } from '../types';
import { Stats } from './stats';

const account = new ZilliqaAccountUtils();
const transaction = new ZilliqaTransactionUtils();
const clients = {};

export const Zilliqa: IBlockchain = {
    config,
    networks,
    transaction,
    account,
    Client,
    getStats: (chainId: ChainIdType) => new Stats(new Client(chainId), config),
    getClient: (chainId: ChainIdType) => {
        chainId = Number(chainId);
        if (!clients[chainId]) {
            clients[chainId] = new Client(chainId);
        }
        return clients[chainId];
    }
};
