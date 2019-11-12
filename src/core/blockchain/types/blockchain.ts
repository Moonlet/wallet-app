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
    STELLAR = 'STELLAR'
}

export interface IBlockchain<TxOptions = any, AccountExtra = {}, TransactionExtra = {}> {
    config: IBlockchainConfig;
    networks: IBlockchainNetwork[];
    transaction: IBlockchainTransactionUtils<TxOptions> & TransactionExtra;
    account: IBlockchainAccountUtils & AccountExtra;
    Client: new (chainId) => BlockchainGenericClient;
    getClient: (chainId: number) => BlockchainGenericClient;
}
