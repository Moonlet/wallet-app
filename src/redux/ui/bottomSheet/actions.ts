import { BottomSheetType, IBottomSheetExtensionRequestData } from './state';
import { Blockchain } from '../../../core/blockchain/types';
import { HWModel, HWConnection } from '../../../core/wallet/hw-wallet/types';

export const CLOSE_BOTTOM_SHEET = 'CLOSE_BOTTOM_SHEET';
export const OPEN_BOTTOM_SHEET = 'OPEN_BOTTOM_SHEET';
export const ENABLE_CREATE_ACCOUNT = 'ENABLE_CREATE_ACCOUNT';
export const DISABLE_CREATE_ACCOUNT = 'DISABLE_CREATE_ACCOUNT';

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
        type: OPEN_BOTTOM_SHEET,
        data: { type, props }
    };
};

export const closeBottomSheet = () => {
    return {
        type: CLOSE_BOTTOM_SHEET
    };
};

export const enableCreateAccount = () => {
    return {
        type: ENABLE_CREATE_ACCOUNT
    };
};

export const disableCreateAccount = () => {
    return {
        type: DISABLE_CREATE_ACCOUNT
    };
};
