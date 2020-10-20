import { IBlockchainNetwork } from '../types';

export const networks: IBlockchainNetwork[] = [
    {
        name: 'Mainnet beta',
        chainId: '1',
        mainNet: true,
        url: 'https://api.mainnet-beta.solana.com',
        wsUrl: 'wss://api.mainnet-beta.solana.com/',
        explorer: {
            name: 'Viewblock',
            getAccountUrl: addr => `https://explorer.solana.com/${addr}`,
            getTransactionUrl: txn => `https://viewblock.io/zilliqa/tx/${txn}`
        }
    },
    {
        name: 'Testnet',
        chainId: '2',
        mainNet: false,
        url: 'https://testnet.solana.com',
        wsUrl: 'wss://testnet.solana.com/',
        explorer: {
            name: 'Explorer',
            getAccountUrl: addr => `https://explorer.solana.com/${addr}?cluster=testnet`,
            getTransactionUrl: txn => `https://viewblock.io/zilliqa/tx/${txn}?cluster=testnet`
        }
    }
];
