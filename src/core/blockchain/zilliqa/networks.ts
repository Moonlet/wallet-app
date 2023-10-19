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
    },
    {
        name: 'Dev 2',
        chainId: 333,
        mainNet: false,
        url: 'https://api.testnet.zilliqa.com/',
        wsUrl: 'wss://dev-ws.zilliqa.com/',
        explorer: {
            name: 'Viewblock',
            getAccountUrl: addr => `https://viewblock.io/zilliqa/address/${addr}?network=testnet`,
            getTransactionUrl: txn => `https://viewblock.io/zilliqa/tx/${txn}?network=testnet`
        }
    },
    {
        name: 'Kaya Local',
        chainId: 2,
        mainNet: false,
        url: 'http://127.0.0.1:4200/',
        explorer: {
            name: 'Viewblock',
            getAccountUrl: () => ``,
            getTransactionUrl: () => ``
        }
    }
];
