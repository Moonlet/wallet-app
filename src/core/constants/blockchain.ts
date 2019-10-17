import { Blockchain } from '../blockchain/types';

export interface IBlockchainInfo {
    coin: string;
    defaultUnit?: string;
}

export const BLOCKCHAIN_INFO: {
    [blockchain: string]: IBlockchainInfo;
} = {
    [Blockchain.ETHEREUM]: {
        coin: 'ETH'
    },
    [Blockchain.ZILLIQA]: {
        coin: 'ZIL'
    },
    [Blockchain.COSMOS]: {
        coin: 'ATOM'
    },
    [Blockchain.STELLAR]: {
        coin: 'XLM'
    }
};
