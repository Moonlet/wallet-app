import {
    IBlockchainConfig,
    IBlockchainNetwork,
    IBlockchainTransaction,
    IBlockchainAccount,
    IBlockchainClient
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
    Client: new (chainId) => IBlockchainClient;
    getClient: (chainId: number) => IBlockchainClient;
}
