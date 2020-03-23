import { IConnectHardwareWalletState } from './state';
import { IAction } from '../../../types';
import { VERIFY_ADDRESS_ON_DEVICE, FEATURE_NOT_SUPPORTED, TO_INITIAL_STATE } from './actions';

const intialState: IConnectHardwareWalletState = {
    verifyAddress: false,
    featureNotSupported: false
};

export default (
    state: IConnectHardwareWalletState = intialState,
    action: IAction
): IConnectHardwareWalletState => {
    switch (action.type) {
        case VERIFY_ADDRESS_ON_DEVICE:
            return { ...state, verifyAddress: action.data };
        case FEATURE_NOT_SUPPORTED:
            return { ...state, featureNotSupported: true };
        case TO_INITIAL_STATE:
            return { ...state, featureNotSupported: false, verifyAddress: false };
        default:
            break;
    }
    return state;
};
