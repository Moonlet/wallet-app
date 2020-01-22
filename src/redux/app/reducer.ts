import { IAppState } from './state';
import { IAction } from '../types';
import {
    APP_SWITCH_WALLET,
    APP_SET_TOS_VERSION,
    APP_OPEN_BOTTOM_SHEET,
    APP_CLOSE_BOTTOM_SHEET,
    APP_SET_SELECTED_BLOCKCHAIN,
    APP_SET_EXTENSION_STATE_LOADED
} from './actions';
import { Blockchain } from '../../core/blockchain/types';

const intialState: IAppState = {
    version: 1,
    currentWalletId: '',
    selectedBlockchain: Blockchain.ETHEREUM,
    tosVersion: 0,

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
