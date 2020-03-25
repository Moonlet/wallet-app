import { IAppState } from './state';
import { IAction } from '../types';
import { SET_ACCEPTED_TC_VERSION, SHOW_HINT } from './actions';

const intialState: IAppState = {
    version: 1,
    tcAcceptedVersion: undefined,
    hints: {
        SEND_SCREEN: {
            ADDRESS_BOOK: 0
        },
        WALLETS_SCREEN: {
            WALLETS_LIST: 0
        },
        MANAGE_ACCOUNT: {
            TOKENS_LIST: 0
        }
    }
};

export default (state: IAppState = intialState, action: IAction): IAppState => {
    switch (action.type) {
        case SET_ACCEPTED_TC_VERSION:
            return {
                ...state,
                tcAcceptedVersion: action.data
            };

        case SHOW_HINT:
            return {
                ...state,
                hints: {
                    ...state.hints,
                    [action.data.screen]: {
                        [action.data.component]:
                            state.hints[action.data.screen][action.data.component] + 1
                    }
                }
            };

        default:
            break;
    }
    return state;
};
