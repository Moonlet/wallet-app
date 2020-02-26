import { IBlockchainNetwork } from '../types';

export const networks: IBlockchainNetwork[] = [
    {
        name: 'Main Network',
        chainId: 'cosmoshub-3',
        mainNet: true,
        url: 'https://api.cosmos.network',
        explorer: {
            name: 'Mintscan',
            getAccountUrl: addr => `https://www.mintscan.io/account/${addr}`,
            getTransactionUrl: txn => `https://www.mintscan.io/txs/${txn}`
        }
    },
    {
        name: 'Testnet',
        chainId: 'gaia-13007',
        mainNet: false,
        url: 'http://testwallet.syncnode.ro:1317',
        explorer: {
            name: 'Gaia Stake',
            getAccountUrl: addr => `https://gaia.stake.id/?#/address/${addr}`,
            getTransactionUrl: txn => `https://gaia.stake.id/?#/tx/${txn}`
        }
    }
];
