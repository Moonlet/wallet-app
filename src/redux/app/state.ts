import { Blockchain } from '../../core/blockchain/types';
import { HWModel, HWConnection } from '../../core/wallet/hw-wallet/types';

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
    deviceModel?: HWModel;
    connectionType?: HWConnection;
}

export enum BottomSheetType {
    ACCOUNTS = 'ACCOUNTS',
    DASHBOARD_MENU = 'DASHBOARD_MENU',
    LEDGER_SIGN_MESSAGES = 'LEDGER_SIGN_MESSAGES',
    LEDGER_CONNECT = 'LEDGER_CONNECT'
}

export interface ICurrentAccount {
    index: number;
    blockchain: Blockchain;
}

export interface IAppState {
    currentWalletId: string;
    currentAccount: ICurrentAccount;
    tosVersion: number;
    devMode: boolean;
    testNet: boolean;
    networks: INetworksOptions;
    blockchains: IBlockchainsOptions;
    bottomSheet: IBottomSheet;
}
