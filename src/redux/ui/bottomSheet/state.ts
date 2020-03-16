import { Blockchain } from '../../../core/blockchain/types';

import { HWModel, HWConnection } from '../../../core/wallet/hw-wallet/types';

export interface IBottomSheetState {
    type: BottomSheetType;
    blockchain: Blockchain;
    deviceModel: HWModel;
    connectionType: HWConnection;
    data: IBottomSheetExtensionRequestData;
}

export enum BottomSheetType {
    ACCOUNTS = 'ACCOUNTS',
    DASHBOARD_MENU = 'DASHBOARD_MENU',
    LEDGER_CONNECT = 'LEDGER_CONNECT',
    EXTENSION_REQUEST = 'EXTENSION_REQUEST',
    BLOCKCHAIN_NAVIGATION = 'BLOCKCHAIN_NAVIGATION'
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

export interface IBottomSheet {
    type: BottomSheetType;
    blockchain?: Blockchain;
    deviceModel?: HWModel;
    connectionType?: HWConnection;
    data?: IBottomSheetExtensionRequestData;
}
