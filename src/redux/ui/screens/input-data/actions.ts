import BigNumber from 'bignumber.js';
import { Dispatch } from 'react';
import { IScreenValidation } from '../../../../components/widgets/types';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { getChainId } from '../../../preferences/selectors';
import { IReduxState } from '../../../state';
import { getTokenConfig } from '../../../tokens/static-selectors';
import { IAction } from '../../../types';
import { getSelectedAccount } from '../../../wallets/selectors';
import { screenInputValidationActions } from './validation/index';

export const TOGGLE_VALIDATOR_MULTIPLE = 'TOGGLE_VALIDATOR_MULTIPLE';
export const SET_INPUT = 'SET_INPUT';
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

export const setScreenInputData = (screenKey: string, inputData: any, inputKey: string) => async (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    dispatch({
        type: SET_INPUT,
        data: {
            screenKey,
            inputData,
            inputKey
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
    const blockchainInstance = getBlockchain(blockchain);
    const chainId = getChainId(state, blockchain);
    const token = account.tokens[chainId][blockchainInstance.config.coin];
    const balance = token.balance?.available || '0';

    const tokenConfig = getTokenConfig(blockchain, token.symbol);

    const amountFromStd = blockchainInstance.account
        .amountFromStd(new BigNumber(balance), tokenConfig.decimals)
        .toString();

    // Set screen amount
    setScreenInputData(screenKey, amountFromStd, 'screenAmount')(dispatch, getState);
    setScreenInputData(screenKey, amountFromStd, 'inputAmount')(dispatch, getState);
};

export const runScreenValidation = (validation: IScreenValidation, screenKey: string) => async (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    const validators = validation.validators;

    for (const validator of Object.keys(validators)) {
        for (const val of validators[validator]) {
            if (typeof screenInputValidationActions[val.fn] === 'function') {
                screenInputValidationActions[val.fn](val, screenKey, getState, dispatch);
            }
        }
    }
};
