import { Dispatch } from 'react';
import { IReduxState } from '../../../state';
import { IAction } from '../../../types';

export const TOGGLE_VALIDATOR_MULTIPLE = 'TOGGLE_VALIDATOR_MULTIPLE';
export const SELECT_VALIDATOR = 'SELECT_VALIDATOR';
export const CLEAR_INPUT = 'CLEAR_INPUT';

export const toggleValidatorMultiple = (
    screenKey: string,
    validator: {
        id: string;
        name: string;
    }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    dispatch({
        type: TOGGLE_VALIDATOR_MULTIPLE,
        data: {
            screenKey,
            validator
        }
    });
};

export const selectValidator = (
    screenKey: string,
    validator: {
        id: string;
        name: string;
    }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    dispatch({
        type: SELECT_VALIDATOR,
        data: {
            screenKey,
            validator
        }
    });
};

export const clearInput = (screenKey: string) => async (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    dispatch({
        type: CLEAR_INPUT,
        data: {
            screenKey
        }
    });
};
