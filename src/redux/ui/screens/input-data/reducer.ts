import { IScreenInputState } from './state';
import { IAction } from '../../../types';
import {
    QUICK_STAKE_VALIDATOR_MULTIPLE_SELECTION,
    QUICK_STAKE_VALIDATOR_SINGLE_SELECTION,
    QUICK_STAKE_VALIDATOR_CLEAR
} from './actions';

const intialState: IScreenInputState = {};

export default (state: IScreenInputState = intialState, action: IAction): IScreenInputState => {
    switch (action.type) {
        case QUICK_STAKE_VALIDATOR_MULTIPLE_SELECTION:
            const validatorId = action.data.validatorId;
            const validators: any = state[action.data.screenKey]?.validators || [];
            const validatorIndex = validators.indexOf(validatorId);

            if (validatorIndex === -1) {
                // select validator
                validators.push(validatorId);
            } else {
                // unselect validator
                validators.splice(validatorIndex, 1);
            }

            return {
                ...state,
                [action.data.screenKey]: {
                    ...state[action.data.screenKey],
                    validators
                }
            };

        case QUICK_STAKE_VALIDATOR_SINGLE_SELECTION:
            return {
                ...state,
                [action.data.screenKey]: {
                    ...state[action.data.screenKey],
                    validators: [action.data.validatorId]
                }
            };

        case QUICK_STAKE_VALIDATOR_CLEAR:
            return {
                ...state,
                [action.data.screenKey]: {
                    ...state[action.data.screenKey],
                    validators: []
                }
            };

        default:
            break;
    }
    return state;
};
