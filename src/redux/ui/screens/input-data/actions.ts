import BigNumber from 'bignumber.js';
import { Dispatch } from 'react';
import { IScreenFieldValidation, IScreenValidation } from '../../../../components/widgets/types';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { getChainId } from '../../../preferences/selectors';
import { IReduxState } from '../../../state';
import { getTokenConfig } from '../../../tokens/static-selectors';
import { IAction } from '../../../types';
import { getSelectedAccount } from '../../../wallets/selectors';

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

const amountAvailableFunds = (
    validation: IScreenFieldValidation,
    screenKey: string,
    getState: () => IReduxState,
    dispatch: Dispatch<IAction<any>>
) => {
    const state = getState();

    const account = getSelectedAccount(state);

    const inputData: any = state.ui.screens.inputData[screenKey];

    const blockchain = account.blockchain;
    const blockchainInstance = getBlockchain(blockchain);
    const chainId = getChainId(state, blockchain);
    const token = account.tokens[chainId][blockchainInstance.config.coin];

    const tokenConfig = getTokenConfig(blockchain, token.symbol);

    const inputAmount = inputData?.inputAmount;
    const inputAmountToStd = blockchainInstance.account.amountToStd(
        new BigNumber(inputAmount),
        tokenConfig.decimals
    );

    const screenAmount = inputData?.screenAmount;
    const screenAmountToStd = blockchainInstance.account.amountToStd(
        new BigNumber(screenAmount),
        tokenConfig.decimals
    );

    const regexMultipleDots = /(\..*){2,}/;

    if (inputAmountToStd.isGreaterThan(screenAmountToStd) || regexMultipleDots.test(inputAmount)) {
        // Show error

        const fieldsErrors = [];

        for (const msgKey of Object.keys(validation?.messages || [])) {
            fieldsErrors.push(validation.messages[msgKey]);
        }

        setScreenInputData(
            screenKey,
            {
                fieldsErrors,
                valid: false
            },
            'validation'
        )(dispatch, getState);
    } else {
        // Valid input

        setScreenInputData(
            screenKey,
            {
                fieldsErrors: undefined,
                valid: true
            },
            'validation'
        )(dispatch, getState);
    }
};

const amountAvailableFundsToKeep = (
    validation: IScreenFieldValidation,
    screenKey: string,
    getState: () => IReduxState,
    dispatch: Dispatch<IAction<any>>
) => {
    const state = getState();

    const account = getSelectedAccount(state);

    const inputData: any = state.ui.screens.inputData[screenKey];

    const blockchain = account.blockchain;
    const blockchainInstance = getBlockchain(blockchain);
    const chainId = getChainId(state, blockchain);
    const token = account.tokens[chainId][blockchainInstance.config.coin];

    const tokenConfig = getTokenConfig(blockchain, token.symbol);

    const inputAmount = inputData?.inputAmount;
    const inputAmountToStd = blockchainInstance.account.amountToStd(
        new BigNumber(inputAmount),
        tokenConfig.decimals
    );

    const screenAmount = inputData?.screenAmount;
    const screenAmountToStd = blockchainInstance.account.amountToStd(
        new BigNumber(screenAmount),
        tokenConfig.decimals
    );

    const minimumAmountToKeep = blockchainInstance.config.amountToKeepInAccount[account.type];

    if (
        screenAmountToStd.isLessThan(inputAmountToStd) &&
        inputAmountToStd.isLessThan(screenAmountToStd.plus(minimumAmountToKeep))
    ) {
        // Show error

        const fieldsErrors = [];

        for (const msgKey of Object.keys(validation?.messages || [])) {
            fieldsErrors.push(validation.messages[msgKey]);
        }

        setScreenInputData(
            screenKey,
            {
                fieldsErrors,
                valid: false
            },
            'validation'
        )(dispatch, getState);
    }
};

const validationActions = {
    amountAvailableFunds,
    amountAvailableFundsToKeep
};

export const runScreenValidation = (validation: IScreenValidation, screenKey: string) => async (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    const validators = validation.validators;

    for (const validator of Object.keys(validators)) {
        for (const val of validators[validator]) {
            if (typeof validationActions[val.fn] === 'function') {
                validationActions[val.fn](val, screenKey, getState, dispatch);
            }
        }
    }
};
