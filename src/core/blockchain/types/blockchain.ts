import {
    IBlockchainConfig,
    IBlockchainNetwork,
    IBlockchainAccountUtils,
    BlockchainGenericClient,
    IBlockchainTransactionUtils,
    ChainIdType
} from './';

export enum Blockchain {
    ETHEREUM = 'ETHEREUM',
    ZILLIQA = 'ZILLIQA',
    NEAR = 'NEAR',
    COSMOS = 'COSMOS',
    STELLAR = 'STELLAR'
}

export interface IBlockchain {
    config: IBlockchainConfig;
    networks: IBlockchainNetwork[];
    transaction: IBlockchainTransactionUtils;
    account: IBlockchainAccountUtils;
    Client: new (chainId) => BlockchainGenericClient;
    getClient: (chainId: ChainIdType) => BlockchainGenericClient;
}
