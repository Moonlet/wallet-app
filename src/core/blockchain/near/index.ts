import { config } from './config';
import { networks } from './networks';
import { Client } from './client';
import * as transaction from './transaction';
import * as account from './account';
import { IBlockchain, ChainIdType } from '../types';
import BigNumber from 'bignumber.js';
import { Stats } from './stats';

export const Near: IBlockchain = {
    config,
    networks,
    transaction,
    account,
    Client,
    getStats: (chainId: ChainIdType) => new Stats(new Client(chainId), config),
    getClient: (chainId: ChainIdType) => new Client(chainId)
};

export enum NearTransactionActionType {
    TRANSFER = 'TRANSFER'
}

export interface INearTransactionAction {
    type: NearTransactionActionType;
    params?: {};
}

export interface INearTransactionAdditionalInfoType {
    currentBlockHash: string;
    actions: INearTransactionAction[];
}

export interface INearAccount {
    address: string;
    name: string;
    amount: BigNumber;
    exists: boolean;
}
