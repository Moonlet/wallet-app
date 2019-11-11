import {
    IBlockchainConfig,
    IBlockchainNetwork,
    IBlockchainTransaction,
    IBlockchainAccount,
    BlockchainGenericClient
} from './';

export enum Blockchain {
    ETHEREUM = 'ETHEREUM',
    ZILLIQA = 'ZILLIQA',
    COSMOS = 'COSMOS',
    STELLAR = 'STELLAR'
}

export interface IBlockchain<AccountExtra = {}, TransactionExtra = {}> {
    config: IBlockchainConfig;
    networks: IBlockchainNetwork[];
    transaction: IBlockchainTransaction & TransactionExtra;
    account: IBlockchainAccount & AccountExtra;
    Client: new (chainId) => BlockchainGenericClient;
    getClient: (chainId: number) => BlockchainGenericClient;
}
