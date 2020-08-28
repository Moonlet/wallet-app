import { IBlockchainNetwork } from '../types';

export const networks: IBlockchainNetwork[] = [
    {
        name: 'Alfajores',
        chainId: 44787,
        mainNet: false,
        url: 'https://alfajores-forno.celo-testnet.org/',
        explorer: {
            name: 'Alfajores',
            getAccountUrl: addr => `https://alfajores-blockscout.celo-testnet.org/address/${addr}`,
            getTransactionUrl: txn => `https://alfajores-blockscout.celo-testnet.org/tx/${txn}`
        }
    },
    {
        name: 'Baklava',
        chainId: 62320,
        mainNet: false,
        url: 'https://baklava-forno.celo-testnet.org/',
        explorer: {
            name: 'Baklava',
            getAccountUrl: addr => `https://baklava-blockscout.celo-testnet.org/address/${addr}`,
            getTransactionUrl: txn => `https://baklava-blockscout.celo-testnet.org/tx/${txn}`
        }
    },
    {
        name: 'Mainnet',
        chainId: 42220,
        mainNet: true,
        url: 'https://rc1-forno.celo-testnet.org/',
        explorer: {
            name: 'Mainnet',
            getAccountUrl: addr => `https://explorer.celo.org/address/${addr}`,
            getTransactionUrl: txn => `https://explorer.celo.org/tx/${txn}`
        }
    }
];
