import { IAppState } from './state';
import { IAction } from '../types';
import { APP_SWITCH_WALLET, APP_SET_TOS_VERSION } from './actions';

const intialState: IAppState = {
    currentWalletIndex: 1,
    tosVersion: 0
};

export default (state: IAppState = intialState, action: IAction): IAppState => {
    switch (action.type) {
        case APP_SWITCH_WALLET:
            return { ...state, currentWalletIndex: action.data };
        case APP_SET_TOS_VERSION:
            return { ...state, tosVersion: action.data };
        default:
            break;
    }
    return state;
};
