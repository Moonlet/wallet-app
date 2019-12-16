import { IAppState } from './state';
import { IAction } from '../types';
import {
    APP_SWITCH_WALLET,
    APP_SET_TOS_VERSION,
    APP_SET_TEST_NET,
    APP_SET_NETWORK_TEST_NET_CHAIN_ID,
    APP_TOGGLE_BLOCKCHAIN,
    APP_UPDATE_BLOCKCHAIN_ORDER,
    APP_SET_BOTTOM_SHEET
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
    },
    blockchains: {
        [Blockchain.ETHEREUM]: {
            order: 0,
            active: true
        },
        [Blockchain.ZILLIQA]: {
            order: 1,
            active: true
        }
    },
    bottomSheet: undefined
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
        case APP_SET_NETWORK_TEST_NET_CHAIN_ID:
            return {
                ...state,
                networks: {
                    ...state.networks,
                    [action.data.blockchain]: {
                        ...state.networks[action.data.blockchain],
                        testNet: action.data.chainId
                    }
                }
            };
        case APP_TOGGLE_BLOCKCHAIN:
            return {
                ...state,
                blockchains: {
                    ...state.blockchains,
                    [action.data.blockchain]: {
                        ...state.blockchains[action.data.blockchain],
                        active: !state.blockchains[action.data.blockchain].active
                    }
                }
            };
        case APP_UPDATE_BLOCKCHAIN_ORDER:
            return {
                ...state,
                blockchains: action.data.blockchains
            };
        case APP_SET_BOTTOM_SHEET:
            return {
                ...state,
                bottomSheet: {
                    type: action.data.type,
                    blockchain: action.data.blockchain
                }
            };
        default:
            break;
    }
    return state;
};
