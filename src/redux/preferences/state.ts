import { ChainIdType } from '../../core/blockchain/types';

export interface IPrefState {
    currency: string;
    testNet: boolean;
    biometricActive: boolean;
    networks: INetworksOptions;
    blockchains: IBlockchainsOptions;
    deviceId: string;
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
