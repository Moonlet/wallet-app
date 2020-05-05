import { IAppState } from './state';
import { IAction } from '../types';
import {
    SET_ACCEPTED_TC_VERSION,
    SHOW_HINT,
    RESET_FAILED_LOGINS,
    INCREMENT_FAILED_LOGINS,
    SET_APP_BLOCK_UNTIL,
    RESET_ALL_DATA,
    REDUX_UPDATE_STATE
} from './actions';

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
    },
    failedLogins: 0,
    blockUntil: undefined
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

        case RESET_FAILED_LOGINS:
            return {
                ...state,
                failedLogins: 0
            };

        case INCREMENT_FAILED_LOGINS:
            return {
                ...state,
                failedLogins: state.failedLogins + 1
            };

        case SET_APP_BLOCK_UNTIL:
            return {
                ...state,
                blockUntil: action.data.date
            };

        case RESET_ALL_DATA:
            return intialState;

        case REDUX_UPDATE_STATE: {
            return {
                ...state,
                version: action.data.state.app.version
            };
        }

        default:
            break;
    }
    return state;
};
