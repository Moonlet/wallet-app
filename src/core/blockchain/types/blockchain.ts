import {
    IBlockchainConfig,
    IBlockchainNetwork,
    IBlockchainAccountUtils,
    BlockchainGenericClient,
    IBlockchainTransactionUtils
} from './';

export enum Blockchain {
    ETHEREUM = 'ETHEREUM',
    ZILLIQA = 'ZILLIQA',
    COSMOS = 'COSMOS',
    STELLAR = 'STELLAR',
    NEAR = 'NEAR'
}

export interface IBlockchain {
    config: IBlockchainConfig;
    networks: IBlockchainNetwork[];
    transaction: IBlockchainTransactionUtils;
    account: IBlockchainAccountUtils;
    Client: new (chainId) => BlockchainGenericClient;
    getClient: (chainId: number) => BlockchainGenericClient;
}
