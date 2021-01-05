import { IPrefState } from './state';
import { IAction } from '../types';
import {
    PREF_SET_CURRENCY,
    TOGGLE_BIOMETRIC_AUTH,
    SET_TEST_NET,
    PREF_SET_NETWORK_TEST_NET_CHAIN_ID,
    PREF_SET_BLOCKCHAIN_ACTIVE_STATE,
    PREF_SET_BLOCKCHAIN_ORDER,
    PREF_SET_DEVICE_ID,
    TOGGLE_CUMULATIVE_BALANCE
} from './actions';
import { RESET_ALL_DATA, EXTENSION_UPDATE_STATE } from '../app/actions';

const initialState: IPrefState = {
    currency: 'USD',
    testNet: false,
    biometricActive: false,
    networks: {},
    blockchains: {},
    deviceId: '',
    cumulativeBalance: false
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

        case TOGGLE_BIOMETRIC_AUTH:
            return {
                ...state,
                biometricActive: !state.biometricActive
            };

        case TOGGLE_CUMULATIVE_BALANCE:
            return {
                ...state,
                cumulativeBalance: !state.cumulativeBalance
            };

        case PREF_SET_CURRENCY:
            return {
                ...state,
                currency: action.data.currency
            };

        case PREF_SET_DEVICE_ID:
            return {
                ...state,
                deviceId: action.data.deviceId
            };

        case RESET_ALL_DATA:
            return initialState;

        case EXTENSION_UPDATE_STATE: {
            return action.data.state.preferences;
        }

        default:
            break;
    }
    return state;
};
