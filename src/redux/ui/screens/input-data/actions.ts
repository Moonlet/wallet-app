import { Dispatch } from 'react';
import { IReduxState } from '../../../state';
import { IAction } from '../../../types';

export const TOGGLE_VALIDATOR_MULTIPLE = 'TOGGLE_VALIDATOR_MULTIPLE';
export const SELECT_INPUT = 'SELECT_INPUT';
export const CLEAR_INPUT = 'CLEAR_INPUT';

export const toggleValidatorMultiple = (
    screenKey: string,
    validator: {
        id: string;
        name: string;
        icon?: string;
        website?: string;
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

export const selectInput = (screenKey: string, inputData: any, inputKey: string) => async (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    dispatch({
        type: SELECT_INPUT,
        data: {
            screenKey,
            inputData,
            inputKey
        }
    });
};

export const clearInput = (screenKey: string, inputData: { [input: string]: any }) => async (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    dispatch({
        type: CLEAR_INPUT,
        data: {
            screenKey,
            inputData
        }
    });
};
