import {
    IBlockchainConfig,
    IBlockchainNetwork,
    IBlockchainAccountUtils,
    BlockchainGenericClient,
    ChainIdType
} from './';
import { GenericStats } from './stats';
import { AbstractBlockchainTransactionUtils } from './transaction';

export enum Blockchain {
    ETHEREUM = 'ETHEREUM',
    ZILLIQA = 'ZILLIQA',
    NEAR = 'NEAR',
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
}
