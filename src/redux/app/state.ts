import { Blockchain } from '../../core/blockchain/types';

export interface INetworksOptions {
    [blockchain: string]: {
        // key is for Blockchain enum
        mainNet?: number;
        testNet?: number;
    };
}

export interface IBlockchainsOptions {
    [blockchain: string]: {
        order: number;
        active: boolean;
    };
}

export interface IBottomSheet {
    type: BottomSheetType;
    blockchain: Blockchain;
}

export enum BottomSheetType {
    ACCOUNTS = 'ACCOUNTS',
    DASHBOARD_MENU = 'DASHBOARD_MENU'
}

export interface IAppState {
    currentWalletId: string;
    tosVersion: number;
    devMode: boolean;
    testNet: boolean;
    networks: INetworksOptions;
    blockchains: IBlockchainsOptions;
    bottomSheet: IBottomSheet;
}
