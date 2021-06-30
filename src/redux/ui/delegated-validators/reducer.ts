import { IAction } from '../../types';
import { IDelegatedValidatorsState } from './state';
import { ADD_DELEGATED_VALIDATORS } from './actions';

const initialState: IDelegatedValidatorsState = {};

export default (
    state: IDelegatedValidatorsState = initialState,
    action: IAction
): IDelegatedValidatorsState => {
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
