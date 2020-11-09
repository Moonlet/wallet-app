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
            const validator = action.data.validator;
            const validators = [];
            Object.assign(validators, state[action.data.screenKey]?.validators);
            const validatorIndex = validators.findIndex(v => v.id === validator.id);

            if (validatorIndex === -1) {
                // select validator
                validators.push(validator);
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
                    validators: [action.data.validator]
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
