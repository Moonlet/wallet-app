import { IAction } from '../../types';
import { IValidatorsState } from './state';
import { ADD_VALIDATORS, SET_IS_LOADING } from './actions';

const initialState: IValidatorsState = {};

export default (state: IValidatorsState = initialState, action: IAction): IValidatorsState => {
    switch (action.type) {
        case ADD_VALIDATORS: {
            return {
                ...state,
                [action.data.blockchain]: {
                    ...state[action.data.blockchain],
                    [action.data.chainId]: {
                        validators: action.data.validators,
                        timestamp: new Date().getTime(),
                        loading: !action.data.validators ? true : false
                    }
                }
            };
        }

        case SET_IS_LOADING:
            return {
                ...state,
                [action.data.blockchain]: {
                    ...state[action.data.blockchain],
                    [action.data.chainId]: {
                        ...([action.data.blockchain] &&
                            [action.data.blockchain][action.data.chainId]),
                        loading: true
                    }
                }
            };

        default:
            break;
    }
    return state;
};
