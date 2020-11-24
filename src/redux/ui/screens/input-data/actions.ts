import { Dispatch } from 'react';
import { IScreenValidation } from '../../../../components/widgets/types';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { getChainId } from '../../../preferences/selectors';
import { IReduxState } from '../../../state';
import { IAction } from '../../../types';
import { getSelectedAccount } from '../../../wallets/selectors';
import { IScreenInputDataValidations } from './state';
import { screenInputValidationActions } from './validation/index';

export const TOGGLE_VALIDATOR_MULTIPLE = 'TOGGLE_VALIDATOR_MULTIPLE';
export const SET_INPUT = 'SET_INPUT';
export const SET_INPUT_VALIDATION = 'SET_INPUT_VALIDATION';
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

export const setScreenInputData = (screenKey: string, inputData: { [key: string]: any }) => async (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    dispatch({
        type: SET_INPUT,
        data: {
            screenKey,
            inputData
        }
    });
};

export const setScreenInputValidation = (
    screenKey: string,
    validation: IScreenInputDataValidations
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    dispatch({
        type: SET_INPUT_VALIDATION,
        data: {
            screenKey,
            validation
        }
    });
};

export const clearScreenInputData = (
    screenKey: string,
    inputData: { [input: string]: any }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    dispatch({
        type: CLEAR_INPUT,
        data: {
            screenKey,
            inputData
        }
    });
};

export const setScreenAmount = (screenKey: string) => async (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    const state = getState();

    const account = getSelectedAccount(state);
    const blockchain = account.blockchain;
    const chainId = getChainId(state, blockchain);
    const token = account.tokens[chainId][getBlockchain(blockchain).config.coin];
    const balance = token.balance?.available || '0';

    // Set screen amount
    setScreenInputData(screenKey, {
        amount: balance
    })(dispatch, getState);
};

export const runScreenValidation = (validation: IScreenValidation, flowId: string) => async (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    const validators = validation.validators;

    for (const field of Object.keys(validators)) {
        for (const val of validators[field]) {
            if (typeof screenInputValidationActions[val.fn] === 'function') {
                screenInputValidationActions[val.fn](val, field, flowId, getState, dispatch);
            }
        }
    }
};
