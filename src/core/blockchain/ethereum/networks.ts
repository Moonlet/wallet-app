import { IBlockchainNetwork } from '../types';

export const networks: IBlockchainNetwork[] = [
    {
        name: 'Main Network',
        chainId: 1,
        mainNet: true,
        url: 'https://mainnet.infura.io/v3/1fc164b9a9054e4bab0f54e3d8d312b8',
        explorer: {
            name: 'Etherscan',
            getAccountUrl: addr => `https://etherscan.io/address/${addr}`,
            getTransactionUrl: txn => `https://etherscan.io/tx/${txn}`
        }
    },
    {
        name: 'Ropsten',
        chainId: 3,
        mainNet: false,
        url: 'https://ropsten.infura.io/v3/1fc164b9a9054e4bab0f54e3d8d312b8',
        explorer: {
            name: 'Etherscan',
            getAccountUrl: addr => `https://ropsten.etherscan.io/address/${addr}`,
            getTransactionUrl: txn => `https://ropsten.etherscan.io/tx/${txn}`
        }
    },
    {
        name: 'Rinkeby',
        chainId: 4,
        mainNet: false,
        url: 'https://rinkeby.infura.io/v3/1fc164b9a9054e4bab0f54e3d8d312b8',
        explorer: {
            name: 'Etherscan',
            getAccountUrl: addr => `https://rinkeby.etherscan.io/address/${addr}`,
            getTransactionUrl: txn => `https://rinkeby.etherscan.io/tx/${txn}`
        }
    },
    {
        name: 'Kovan',
        chainId: 42,
        mainNet: false,
        url: 'https://kovan.infura.io/v3/1fc164b9a9054e4bab0f54e3d8d312b8',
        explorer: {
            name: 'Etherscan',
            getAccountUrl: addr => `https://kovan.etherscan.io/address/${addr}`,
            getTransactionUrl: txn => `https://kovan.etherscan.io/tx/${txn}`
        }
    },
    {
        name: 'Ganache local',
        chainId: 15,
        mainNet: false,
        url: 'http://127.0.0.1:8545/',
        explorer: {
            name: 'Etherscan',
            getAccountUrl: () => ``,
            getTransactionUrl: () => ``
        }
    }
];
