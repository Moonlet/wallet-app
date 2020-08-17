import { IAction } from '../../types';
import { IValidatorsState } from './state';
import { ADD_DELEGATED_VALIDATORS } from './actions';

const initialState: IValidatorsState = {};

export default (state: IValidatorsState = initialState, action: IAction): IValidatorsState => {
    switch (action.type) {
        case ADD_DELEGATED_VALIDATORS:
            return {
                ...state,
                [action.data.blockchain]: {
                    ...state[action.data.blockchain],
                    [action.data.chainId]: action.data.validators
                }
            };
        default:
            break;
    }
    return state;
};
