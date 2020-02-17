import { IBlockchainNetwork } from '../types';

// TODO: update this...
export const networks: IBlockchainNetwork[] = [
    {
        name: 'Testnet',
        chainId: 'testnet',
        mainNet: false,
        url: 'https://rpc.nearprotocol.com',
        explorer: {
            name: 'Explorer',
            getAccountUrl: account => `https://explorer.nearprotocol.com/accounts/${account}`,
            getTransactionUrl: txn => `https://explorer.nearprotocol.com/transactions/${txn}`
        }
    }
];
