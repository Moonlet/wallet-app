import { config } from './config';
import { networks } from './networks';
import { Client } from './client';
import { EthereumTransactionUtils } from './transaction';
import { EthereumAccountUtils } from './account';
import { IBlockchain, ChainIdType, Contracts } from '../types';
import { Stats } from './stats';
import { getContract } from './contracts/base-contract';

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
        chainId = Number(chainId);
        if (!clients[chainId]) {
            clients[chainId] = new Client(chainId);
        }
        return clients[chainId];
    },
    getContract: (chainId: ChainIdType, contractType: Contracts) => {
        return getContract(chainId, contractType);
    }
};
