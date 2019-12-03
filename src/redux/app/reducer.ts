import { IAppState } from './state';
import { IAction } from '../types';
import {
    APP_SWITCH_WALLET,
    APP_SET_TOS_VERSION,
    APP_SET_TEST_NET,
    APP_SET_NETWORK_TEST_NET_CHAIN_ID
} from './actions';
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
        case APP_SET_TEST_NET:
            return {
                ...state,
                testNet: !state.testNet
            };
            break;
        case APP_SET_NETWORK_TEST_NET_CHAIN_ID:
            return {
                ...state,
                networks: {
                    ...state.networks,
                    [action.data.blockchain]: {
                        mainNet: 1,
                        testNet: action.data.chainId
                    }
                }
            };
            break;
        default:
            break;
    }
    return state;
};
