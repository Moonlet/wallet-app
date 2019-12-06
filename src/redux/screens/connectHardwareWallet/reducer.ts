import { IConnectHardwareWalletState } from './state';
import { IAction } from '../../types';
import { VERIFY_ADDRESS_ON_DEVICE, HARDWARE_WALLET_CREATED } from './actions';

const intialState: IConnectHardwareWalletState = {
    verifyAddress: false,
    hardwareWalletCreated: false
};

export default (
    state: IConnectHardwareWalletState = intialState,
    action: IAction
): IConnectHardwareWalletState => {
    switch (action.type) {
        case VERIFY_ADDRESS_ON_DEVICE:
            return { ...state, verifyAddress: action.data };

        case HARDWARE_WALLET_CREATED:
            return { ...state, hardwareWalletCreated: true };

        default:
            break;
    }
    return state;
};
