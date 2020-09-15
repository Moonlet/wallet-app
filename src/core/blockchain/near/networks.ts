import { IBlockchainNetwork } from '../types';

export const networks: IBlockchainNetwork[] = [
    {
        name: 'Mainnet',
        chainId: 'mainnet',
        mainNet: true,
        url: 'https://rpc.mainnet.near.org',
        explorer: {
            name: 'Explorer',
            getAccountUrl: account => `https://explorer.mainnet.near.org/accounts/${account}`,
            getTransactionUrl: txn => `https://explorer.mainnet.near.org/transactions/${txn}`
        }
    },
    {
        name: 'Testnet',
        chainId: 'testnet',
        mainNet: false,
        url: 'https://rpc.testnet.near.org',
        explorer: {
            name: 'Explorer',
            getAccountUrl: account => `https://explorer.testnet.near.org/accounts/${account}`,
            getTransactionUrl: txn => `https://explorer.testnet.near.org/transactions/${txn}`
        },
        links: {
            getWalletLoginUrl: (publicKey: string) =>
                `https://wallet.testnet.near.org/login/?title=Moonlet&referrer=Moonlet&public_key=${publicKey}`
        }
    },
    {
        name: 'Betanet',
        chainId: 'betanet',
        mainNet: false,
        url: 'https://rpc.betanet.near.org',
        explorer: {
            name: 'Explorer',
            getAccountUrl: account => `https://explorer.betanet.near.org/accounts/${account}`,
            getTransactionUrl: txn => `https://explorer.betanet.near.org/transactions/${txn}`
        }
    }
];
