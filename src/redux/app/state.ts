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
    blockchain?: Blockchain;
    deviceModel?: HWModel;
    connectionType?: HWConnection;
    data?: IBottomSheetExtensionRequestData;
}

export enum BottomSheetType {
    ACCOUNTS = 'ACCOUNTS',
    DASHBOARD_MENU = 'DASHBOARD_MENU',
    LEDGER_SIGN_MESSAGES = 'LEDGER_SIGN_MESSAGES',
    LEDGER_CONNECT = 'LEDGER_CONNECT',
    EXTENSION_REQUEST = 'EXTENSION_REQUEST'
}

export enum IExtensionRequestType {
    SIGN_TRANSACTION = 'SIGN_TRANSACTION'
}

export interface IBottomSheetExtensionRequestData {
    type: IExtensionRequestType;
    state: 'pending' | 'completed' | 'rejected';
    mainText: string;
    secondaryText: string;
}

export interface ICurrentAccount {
    index: number;
    blockchain: Blockchain;
}

export interface IAppState {
    currentWalletId: string;
    selectedBlockchain: Blockchain;
    tosVersion: number;
    devMode: boolean;
    testNet: boolean;
    networks: INetworksOptions;
    blockchains: IBlockchainsOptions;
    bottomSheet: IBottomSheet;
}
