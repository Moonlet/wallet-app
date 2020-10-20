import { config } from './config';
import { networks } from './networks';
import { Client } from './client';
import { IBlockchain, ChainIdType } from '../types';
import { Stats } from './stats';
import { SolanaAccountUtils } from './account';
import { SolanaTransactionUtils } from './transaction';

const account = new SolanaAccountUtils();
const transaction = new SolanaTransactionUtils();
const clients = {};

export const Solana: IBlockchain = {
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
