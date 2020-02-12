import { IPrefState } from './state';
import { IAction } from '../types';
import {
    PREF_SET_CURRENCY,
    TOGGLE_TOUCH_ID,
    SET_TEST_NET,
    PREF_SET_NETWORK_TEST_NET_CHAIN_ID,
    PREF_SET_BLOCKCHAIN_ACTIVE_STATE,
    PREF_SET_BLOCKCHAIN_ORDER
} from './actions';
import { Blockchain } from '../../core/blockchain/types';

const initialState: IPrefState = {
    currency: 'USD',
    testNet: false,
    touchID: false,
    networks: {
        [Blockchain.ZILLIQA]: {
            testNet: 333,
            mainNet: 1
        },
        [Blockchain.ETHEREUM]: {
            testNet: 4,
            mainNet: 1
        },
        [Blockchain.NEAR]: {
            testNet: 'testnet'
        }
    },
    blockchains: {
        [Blockchain.ZILLIQA]: {
            order: 0,
            active: true
        },
        [Blockchain.ETHEREUM]: {
            order: 1,
            active: true
        },
        [Blockchain.NEAR]: {
            order: 2,
            active: true
        }
    }
};

export default (state: IPrefState = initialState, action: IAction): IPrefState => {
    switch (action.type) {
        case PREF_SET_NETWORK_TEST_NET_CHAIN_ID:
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
        case PREF_SET_BLOCKCHAIN_ACTIVE_STATE:
            return {
                ...state,
                blockchains: {
                    ...state.blockchains,
                    [action.data.blockchain]: {
                        ...state.blockchains[action.data.blockchain],
                        active: action.data.active
                    }
                }
            };
        case PREF_SET_BLOCKCHAIN_ORDER:
            return {
                ...state,
                blockchains: action.data.blockchains
            };
        case SET_TEST_NET:
            return {
                ...state,
                testNet: !state.testNet
            };
        case TOGGLE_TOUCH_ID:
            state = { ...state };
            state.touchID = !state.touchID;
            break;
        case PREF_SET_CURRENCY:
            return {
                ...state,
                currency: action.data.currency
            };
        default:
            break;
    }
    return state;
};
