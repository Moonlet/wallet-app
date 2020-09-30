import { IAction } from '../types';
import { ADD_TOKEN, UPDATE_TOKEN_CONTRACT_ADDRESS } from './actions';
import { ITokensConfigState } from './state';
import { RESET_ALL_DATA, EXTENSION_UPDATE_STATE } from '../app/actions';

const initialState: ITokensConfigState = {};

export default (state: ITokensConfigState = initialState, action: IAction) => {
    switch (action.type) {
        case ADD_TOKEN: {
            const blockchain = state[action.data.blockchain];

            if (blockchain && blockchain[action.data.chainId]) {
                return {
                    ...state,
                    [action.data.blockchain]: {
                        ...state[action.data.blockchain],
                        [action.data.chainId]: {
                            ...state[action.data.blockchain][action.data.chainId],
                            [action.data.token.symbol]: action.data.token
                        }
                    }
                };
            } else {
                return {
                    ...state,
                    [action.data.blockchain]: {
                        ...state[action.data.blockchain],
                        [action.data.chainId]: {
                            [action.data.token.symbol]: action.data.token
                        }
                    }
                };
            }
        }
        case UPDATE_TOKEN_CONTRACT_ADDRESS: {
            return {
                ...state,
                [action.data.blockchain]: {
                    ...state[action.data.blockchain],
                    [action.data.chainId]: {
                        ...(state[action.data.blockchain] &&
                            state[action.data.blockchain][action.data.chainId]),
                        [action.data.tokenSymbol]: {
                            ...(state[action.data.blockchain] &&
                                state[action.data.blockchain][action.data.chainId] &&
                                state[action.data.blockchain][action.data.chainId][
                                    action.data.tokenSymbol
                                ]),
                            contractAddress: action.data.contractAddress
                        }
                    }
                }
            };
        }
        case RESET_ALL_DATA:
            return initialState;

        case EXTENSION_UPDATE_STATE: {
            return action.data.state.tokens;
        }

        default:
            break;
    }
    return state;
};
