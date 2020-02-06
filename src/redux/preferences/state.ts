import { ChainIdType } from '../../core/blockchain/types';

export interface IPrefState {
    currency: string;
    testNet: boolean;
    touchID: boolean;
    networks: INetworksOptions;
    blockchains: IBlockchainsOptions;
}

export interface INetworksOptions {
    [blockchain: string]: {
        // key is for Blockchain enum
        mainNet?: ChainIdType;
        testNet?: ChainIdType;
    };
}

export interface IBlockchainOptions {
    order: number;
    active: boolean;
}

export interface IBlockchainsOptions {
    [blockchain: string]: IBlockchainOptions;
}
