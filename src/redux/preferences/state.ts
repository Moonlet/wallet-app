import { ChainIdType } from '../../core/blockchain/types';

export interface IPrefState {
    currency: string;
    testNet: boolean;
    pinLogin: boolean;
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

export interface IBlockchainsOptions {
    [blockchain: string]: {
        order: number;
        active: boolean;
    };
}
