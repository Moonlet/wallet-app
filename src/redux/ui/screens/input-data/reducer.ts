import { IScreenInputState } from './state';
import { IAction } from '../../../types';
import { TOGGLE_VALIDATOR_MULTIPLE, SET_INPUT, CLEAR_INPUT, SET_INPUT_VALIDATION } from './actions';

const intialState: IScreenInputState = {};

export default (state: IScreenInputState = intialState, action: IAction): IScreenInputState => {
    switch (action.type) {
        case TOGGLE_VALIDATOR_MULTIPLE:
            const validator = action.data.validator;
            const validators = [];
            Object.assign(validators, state[action.data.screenKey]?.data?.validators);
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
                    data: {
                        ...state[action.data.screenKey]?.data,
                        validators
                    }
                }
            };

        case SET_INPUT:
            return {
                ...state,
                [action.data.screenKey]: {
                    ...state[action.data.screenKey],
                    data: {
                        ...state[action.data.screenKey]?.data,
                        [action.data.inputKey]: action.data.inputData
                    }
                }
            };

        case SET_INPUT_VALIDATION:
            return {
                ...state,
                [action.data.screenKey]: {
                    ...state[action.data.screenKey],
                    validation: action.data.validation
                }
            };

        case CLEAR_INPUT:
            const screenData = state[action.data.screenKey].data;

            for (const inputKey of Object.keys(action.data.inputData || [])) {
                const inputValue = action.data.inputData[inputKey];
                if (screenData && screenData[inputKey]) {
                    screenData[inputKey] = inputValue;
                }
            }

            return {
                ...state,
                [action.data.screenKey]: {
                    ...state[action.data.screenKey],
                    data: {
                        ...state[action.data.screenKey]?.data,
                        ...screenData
                    }
                }
            };

        default:
            break;
    }
    return state;
};
