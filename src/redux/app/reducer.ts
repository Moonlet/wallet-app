import { IAppState } from './state';
import { IAction } from '../types';
import {
    APP_SWITCH_WALLET,
    APP_SET_TOS_VERSION,
    APP_SET_NETWORK_TEST_NET_CHAIN_ID,
    APP_TOGGLE_BLOCKCHAIN,
    APP_UPDATE_BLOCKCHAIN_ORDER,
    APP_OPEN_BOTTOM_SHEET,
    APP_CLOSE_BOTTOM_SHEET,
    APP_SET_SELECTED_BLOCKCHAIN,
    APP_SET_EXTENSION_STATE_LOADED
} from './actions';
import { Blockchain } from '../../core/blockchain/types';

const intialState: IAppState = {
    currentWalletId: '',
    selectedBlockchain: Blockchain.ETHEREUM,
    tosVersion: 0,

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
    bottomSheet: undefined,
    extensionStateLoaded: false
};

export default (state: IAppState = intialState, action: IAction): IAppState => {
    switch (action.type) {
        case APP_SET_SELECTED_BLOCKCHAIN:
            return { ...state, selectedBlockchain: action.data };
        case APP_SWITCH_WALLET:
            return { ...state, currentWalletId: action.data };
        case APP_SET_TOS_VERSION:
            return { ...state, tosVersion: action.data };

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
        case APP_OPEN_BOTTOM_SHEET:
            return {
                ...state,
                bottomSheet: {
                    type: action.data.type,
                    blockchain: action.data.props?.blockchain,
                    deviceModel: action.data.props?.deviceModel,
                    connectionType: action.data.props?.connectionType,
                    data: action.data.props?.data
                }
            };
        case APP_CLOSE_BOTTOM_SHEET:
            return {
                ...state,
                bottomSheet: undefined
            };
        case APP_SET_EXTENSION_STATE_LOADED:
            return {
                ...state,
                extensionStateLoaded: true
            };
        default:
            break;
    }
    return state;
};
