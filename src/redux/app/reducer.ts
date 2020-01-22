import { IAppState } from './state';
import { IAction } from '../types';
import { APP_SWITCH_WALLET, APP_SET_TOS_VERSION, APP_SET_SELECTED_BLOCKCHAIN } from './actions';
import { Blockchain } from '../../core/blockchain/types';

const intialState: IAppState = {
    version: 1,
    currentWalletId: '',
    selectedBlockchain: Blockchain.ETHEREUM,
    tosVersion: 0
};

export default (state: IAppState = intialState, action: IAction): IAppState => {
    switch (action.type) {
        case APP_SET_SELECTED_BLOCKCHAIN:
            return { ...state, selectedBlockchain: action.data };
        case APP_SWITCH_WALLET:
            return { ...state, currentWalletId: action.data };
        case APP_SET_TOS_VERSION:
            return { ...state, tosVersion: action.data };

        default:
            break;
    }
    return state;
};
