import { Dispatch } from 'react';
import { IReduxState } from '../../../state';
import { IAction } from '../../../types';

export const QUICK_STAKE_VALIDATOR_MULTIPLE_SELECTION = 'QUICK_STAKE_VALIDATOR_MULTIPLE_SELECTION';
export const QUICK_STAKE_VALIDATOR_SINGLE_SELECTION = 'QUICK_STAKE_VALIDATOR_SINGLE_SELECTION';
export const QUICK_STAKE_VALIDATOR_CLEAR = 'QUICK_STAKE_VALIDATOR_CLEAR';

export const quickStakeValidatorMultipleSelection = (
    screenKey: string,
    validator: {
        id: string;
        name: string;
    }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    dispatch({
        type: QUICK_STAKE_VALIDATOR_MULTIPLE_SELECTION,
        data: {
            screenKey,
            validator
        }
    });
};

export const quickStakeValidatorSingleSelection = (
    screenKey: string,
    validator: {
        id: string;
        name: string;
    }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    dispatch({
        type: QUICK_STAKE_VALIDATOR_SINGLE_SELECTION,
        data: {
            screenKey,
            validator
        }
    });
};

// TODO: decide when to call this
export const quickStakeValidatorClearSelection = (screenKey: string) => async (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    dispatch({
        type: QUICK_STAKE_VALIDATOR_CLEAR,
        data: {
            screenKey
        }
    });
};
