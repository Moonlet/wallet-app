import { IBlockchainNetwork } from '../types';

// TODO: update this...
export const networks: IBlockchainNetwork[] = [
    {
        name: 'Main Network',
        chainId: 1,
        mainNet: true,
        url: 'https://api.zilliqa.com/',
        explorer: {
            name: 'Viewblock',
            getAccountUrl: addr => `https://viewblock.io/zilliqa/address/${addr}`,
            getTransactionUrl: txn => `https://viewblock.io/zilliqa/tx/${txn}`
        }
    }
];
