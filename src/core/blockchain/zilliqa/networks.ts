import { IBlockchainNetwork } from '../types';

export const networks: IBlockchainNetwork[] = [
    {
        name: 'Main Network',
        chainId: 1,
        mainNet: true,
        url: 'https://node-zilliqa.moonlet.network/api',
        wsUrl: 'wss://api-ws.zilliqa.com/',
        explorer: {
            name: 'Viewblock',
            getAccountUrl: addr => `https://viewblock.io/zilliqa/address/${addr}`,
            getTransactionUrl: txn => `https://viewblock.io/zilliqa/tx/${txn}`
        }
    },
    {
        name: 'Dev',
        chainId: 333,
        mainNet: false,
        url: 'https://dev-api.zilliqa.com/',
        wsUrl: 'wss://dev-ws.zilliqa.com/',
        explorer: {
            name: 'Viewblock',
            getAccountUrl: addr => `https://viewblock.io/zilliqa/address/${addr}?network=testnet`,
            getTransactionUrl: txn => `https://viewblock.io/zilliqa/tx/${txn}?network=testnet`
        }
    }
];
