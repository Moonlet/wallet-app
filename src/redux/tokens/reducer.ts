import { IAction } from '../types';
import { ADD_TOKEN } from './actions';
import { ITokensConfigState } from './state';

const intialState: ITokensConfigState = {};

export default (state: ITokensConfigState = intialState, action: IAction) => {
    switch (action.type) {
        case ADD_TOKEN:
            return {
                ...state,
                [action.data.blockchain]: {
                    ...state[action.data.blockchain],
                    [action.data.chainId]: {
                        ...state[action.data.chainId],
                        [action.data.token.symbol]: action.data.token
                    }
                }
            };

        default:
            break;
    }
    return state;
};
