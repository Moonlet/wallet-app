import {
    IBlockchainConfig,
    IBlockchainNetwork,
    IBlockchainAccountUtils,
    BlockchainGenericClient,
    ChainIdType,
    Contracts
} from './';
import { GenericStats } from './stats';
import { AbstractBlockchainTransactionUtils } from './transaction';

export enum Blockchain {
    ETHEREUM = 'ETHEREUM',
    ZILLIQA = 'ZILLIQA',
    NEAR = 'NEAR',
    SOLANA = 'SOLANA',
    COSMOS = 'COSMOS',
    CELO = 'CELO'
}

export interface IBlockchain {
    config: IBlockchainConfig;
    networks: IBlockchainNetwork[];
    transaction: AbstractBlockchainTransactionUtils;
    account: IBlockchainAccountUtils;
    Client: new (chainId) => BlockchainGenericClient;
    getStats: (chainId: ChainIdType) => GenericStats;
    getClient: (chainId: ChainIdType) => BlockchainGenericClient;
    getContract: (chainId: ChainIdType, contractType: Contracts) => Promise<string>;
}

export enum WsEvent {
    NEW_BLOCK = 'NEW_BLOCK',
    TXN_LOG = 'TXN_LOG'
}
