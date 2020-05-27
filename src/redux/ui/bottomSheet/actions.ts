import { BottomSheetType, IBottomSheetExtensionRequestData } from './state';
import { Blockchain } from '../../../core/blockchain/types';
import { HWModel, HWConnection } from '../../../core/wallet/hw-wallet/types';
import { IWalletState } from '../../wallets/state';

export const CLOSE_BOTTOM_SHEET = 'CLOSE_BOTTOM_SHEET';
export const OPEN_BOTTOM_SHEET = 'OPEN_BOTTOM_SHEET';

export const openBottomSheet = (
    type: BottomSheetType,
    props?: {
        blockchain?: Blockchain;
        deviceModel?: HWModel;
        connectionType?: HWConnection;
        data?: IBottomSheetExtensionRequestData;
        wallets?: IWalletState[];
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
