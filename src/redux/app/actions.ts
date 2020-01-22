import { Blockchain } from '../../core/blockchain/types';
import { BottomSheetType, IBottomSheetExtensionRequestData } from './state';
import { HWModel, HWConnection } from '../../core/wallet/hw-wallet/types';

// actions consts
export const APP_SWITCH_WALLET = 'APP_STATE_SWITCH_WALLET';
export const APP_SET_TOS_VERSION = 'APP_SET_TOS_VERSION';
export const APP_OPEN_BOTTOM_SHEET = 'APP_OPEN_BOTTOM_SHEET';
export const APP_CLOSE_BOTTOM_SHEET = 'APP_CLOSE_BOTTOM_SHEET';
export const APP_SET_SELECTED_BLOCKCHAIN = 'APP_SET_SELECTED_BLOCKCHAIN';
export const APP_SET_EXTENSION_STATE_LOADED = 'APP_SET_EXTENSION_STATE_LOADED';

// actions creators
export const appSwitchWallet = (walletId: string) => {
    return {
        type: APP_SWITCH_WALLET,
        data: walletId
    };
};

export const appSetTosVersion = (version: number) => {
    return {
        type: APP_SET_TOS_VERSION,
        data: version
    };
};

export const setSelectedBlockchain = (blockchain: Blockchain) => {
    return {
        type: APP_SET_SELECTED_BLOCKCHAIN,
        data: blockchain
    };
};

export const openBottomSheet = (
    type: BottomSheetType,
    props?: {
        blockchain?: Blockchain;
        deviceModel?: HWModel;
        connectionType?: HWConnection;
        data?: IBottomSheetExtensionRequestData;
    }
) => {
    return {
        type: APP_OPEN_BOTTOM_SHEET,
        data: { type, props }
    };
};

export const closeBottomSheet = () => {
    return {
        type: APP_CLOSE_BOTTOM_SHEET
    };
};

export const appSetExtensionStateLoaded = () => {
    return {
        type: APP_SET_EXTENSION_STATE_LOADED
    };
};
