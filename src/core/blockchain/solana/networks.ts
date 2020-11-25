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
        url: 'https://testnet.solana.com',
        wsUrl: 'wss://testnet.solana.com/',
        explorer: {
            name: 'Explorer',
            getAccountUrl: addr => `https://explorer.solana.com/address/${addr}?cluster=testnet`,
            getTransactionUrl: txn => `https://explorer.solana.com/tx/${txn}?cluster=testnet`
        }
    }
];
