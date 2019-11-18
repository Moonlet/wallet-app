import { IAppState } from './state';
import { IAction } from '../types';
import { APP_SWITCH_WALLET, APP_SET_TOS_VERSION } from './actions';
import { Blockchain } from '../../core/blockchain/types';

const intialState: IAppState = {
    currentWalletId: '',
    tosVersion: 0,
    devMode: true,
    testNet: true,
    networks: {
        [Blockchain.ETHEREUM]: {
            testNet: 4,
            mainNet: 1
        },
        [Blockchain.ZILLIQA]: {
            testNet: 333,
            mainNet: 1
        }
    }
};

export default (state: IAppState = intialState, action: IAction): IAppState => {
    switch (action.type) {
        case APP_SWITCH_WALLET:
            return { ...state, currentWalletId: action.data };
        case APP_SET_TOS_VERSION:
            return { ...state, tosVersion: action.data };
        default:
            break;
    }
    return state;
};
