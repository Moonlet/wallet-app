import { IConnectHardwareWalletState } from './state';
import { IAction } from '../../types';
import { VERIFY_ADDRESS_ON_DEVICE } from './actions';

const intialState: IConnectHardwareWalletState = {
    verifyAddress: false
};

export default (
    state: IConnectHardwareWalletState = intialState,
    action: IAction
): IConnectHardwareWalletState => {
    switch (action.type) {
        case VERIFY_ADDRESS_ON_DEVICE:
            return { ...state, verifyAddress: action.data };

        default:
            break;
    }
    return state;
};
