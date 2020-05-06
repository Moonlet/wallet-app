import { config } from './config';
import { networks } from './networks';
import { Client } from './client';
import { EthereumTransactionUtils } from './transaction';
import { EthereumAccountUtils } from './account';
import { IBlockchain, ChainIdType } from '../types';
import { Stats } from './stats';

const account = new EthereumAccountUtils();
const transaction = new EthereumTransactionUtils();

const clients = {};

export const Ethereum: IBlockchain = {
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
