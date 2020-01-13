import { IConnectHardwareWalletState } from './state';
import { IAction } from '../../types';
import {
    VERIFY_ADDRESS_ON_DEVICE,
    FEATURE_NOT_SUPPORTED,
    TO_INITIAL_STATE,
    CONNECT_IN_PROGRESS
} from './actions';

const intialState: IConnectHardwareWalletState = {
    verifyAddress: false,
    featureNotSupported: false,
    connectInProgress: false
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
        case CONNECT_IN_PROGRESS:
            return { ...state, connectInProgress: true };
        case TO_INITIAL_STATE:
            return { ...state, featureNotSupported: false, verifyAddress: false };
        default:
            break;
    }
    return state;
};
