import { IBlockchainNetwork } from '../types';

export const networks: IBlockchainNetwork[] = [
    {
        name: 'Mainnet beta',
        chainId: '1',
        mainNet: true,
        url: 'https://api.mainnet-beta.solana.com',
        wsUrl: 'wss://api.mainnet-beta.solana.com/',
        explorer: {
            name: 'Explorer',
            getAccountUrl: addr => `https://explorer.solana.com/address/${addr}`,
            getTransactionUrl: txn => `https://explorer.solana.com/tx/${txn}`
        }
    },
    {
        name: 'Devnet',
        chainId: '2',
        mainNet: false,
        url: 'https://devnet.solana.com',
        wsUrl: 'wss://devnet.solana.com/',
        explorer: {
            name: 'Explorer',
            getAccountUrl: addr => `https://explorer.solana.com/address/${addr}?cluster=devnet`,
            getTransactionUrl: txn => `https://explorer.solana.com/tx/${txn}?cluster=devnet`
        }
    },
    {
        name: 'Testnet',
        chainId: '3',
        mainNet: false,
        url: 'http://167.233.14.77/',
        wsUrl: 'wss://testnet.solana.com/',
        explorer: {
            name: 'Explorer',
            getAccountUrl: addr => `https://explorer.solana.com/address/${addr}?cluster=testnet`,
            getTransactionUrl: txn => `https://explorer.solana.com/tx/${txn}?cluster=testnet`
        }
    },

    {
        name: 'Moonlet dev',
        chainId: '4',
        mainNet: false,
        url: 'http://116.202.172.216:8899/',
        wsUrl: 'wss://testnet.solana.com/',
        explorer: {
            name: 'Explorer',
            getAccountUrl: addr => `https://116.202.172.216:8899/address/${addr}?cluster=testnet`,
            getTransactionUrl: txn => `https://116.202.172.216:8899/tx/${txn}?cluster=testnet`
        }
    }
];
