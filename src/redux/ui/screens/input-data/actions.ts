import { Dispatch } from 'react';
import {
    IAmountInputData,
    IScreenContext,
    IScreenModule,
    IScreenValidation,
    IStateSelector
} from '../../../../components/widgets/types';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { SwapType } from '../../../../core/blockchain/types/token';
import { IReduxState } from '../../../state';
import { IAction } from '../../../types';
import { getSelectedBlockchain } from '../../../wallets/selectors';
import { screenActions } from './screen-actions';
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

export const setScreenAmount = (
    balance: string,
    options: {
        screenKey: string;
        context: IScreenContext;
        inputKey?: string;
    }
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    const data = options?.inputKey
        ? {
              [options?.inputKey]: balance
          }
        : { amount: balance };

    setScreenInputData(options.screenKey, data)(dispatch, getState);

    const state = getState();

    runScreenValidation(
        state.ui.screens.data[options.context.screen][options.screenKey].response?.validation,
        options.screenKey
    )(dispatch, getState);
};

export const setFlowAmount = (balance: string, flowId: string) => async (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    setScreenInputData(flowId, {
        amount: balance
    })(dispatch, getState);
};

export const runScreenValidation = (validation: IScreenValidation, flowId: string) => async (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    const validators = validation?.validators || {};

    for (const field of Object.keys(validators)) {
        for (const val of validators[field]) {
            if (typeof screenInputValidationActions[val.fn] === 'function') {
                screenInputValidationActions[val.fn](val, field, flowId, getState, dispatch);
            }
        }
    }
};

export const runScreenStateActions = (options: {
    actions: IStateSelector[];
    context: IScreenContext;
    screenKey: string;
}) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    for (const action of options.actions) {
        if (typeof screenActions[action.fn] === 'function') {
            screenActions[action.fn](
                action?.params,
                options.context,
                options.screenKey,
                dispatch,
                getState
            );
        }
    }
};

export const setSwapInputAmount = (context: IScreenContext, screenKey: string) => async (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    const state = getState();
    const blockchain = getSelectedBlockchain(state);

    const screenData =
        screenKey && state.ui.screens.inputData && state.ui.screens.inputData[screenKey]?.data;

    if (!screenKey || !screenData) return;

    // don't populate fields if empty input
    if (
        (screenData?.swapAmountFrom === '' && screenData?.swapAmountTo === '') ||
        (screenData?.swapAmountFrom === undefined && screenData?.swapAmountTo === undefined)
    )
        return;

    const inputFieldFocus = screenData?.inputFieldFocus;

    const toInput = inputFieldFocus === 'swapAmountFrom' ? 'swapAmountTo' : 'swapAmountFrom';

    const fromTokenAmount = screenData?.swapPrice?.fromTokenAmount;
    const toTokenAmount = screenData?.swapPrice?.toTokenAmount;

    const blockchainInstance = getBlockchain(blockchain);

    const swapType = screenData?.swapType;

    let amount = '';

    if (swapType === SwapType.SELL) {
        // SELL
        if (inputFieldFocus === 'swapAmountFrom') {
            const decimals = screenData.swapToToken.decimals;
            amount = blockchainInstance.account.amountFromStd(toTokenAmount, decimals).toFixed();
        }
        if (inputFieldFocus === 'swapAmountTo') {
            const decimals = screenData.swapFromToken.decimals;
            amount = blockchainInstance.account.amountFromStd(fromTokenAmount, decimals).toFixed();
        }
    } else {
        // BUY
        if (inputFieldFocus === 'swapAmountFrom') {
            const decimals = screenData.swapToToken.decimals;
            amount = blockchainInstance.account.amountFromStd(fromTokenAmount, decimals).toFixed();
        }
        if (inputFieldFocus === 'swapAmountTo') {
            const decimals = screenData.swapFromToken.decimals;
            amount = blockchainInstance.account.amountFromStd(toTokenAmount, decimals).toFixed();
        }
    }

    setScreenAmount(amount, {
        screenKey,
        context,
        inputKey: toInput
    })(dispatch, getState);
};

const setAmountInputFieldFocus = (
    module: IScreenModule,
    context: IScreenContext,
    screenKey: string,
    params: any[]
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    const state = getState();

    const inputKey = module?.details?.inputKey;

    const screenData =
        screenKey && state.ui.screens.inputData && state.ui.screens.inputData[screenKey]?.data;

    if (screenData && inputKey) {
        // Update input field focus - the amount input in which the user enters
        setScreenInputData(screenKey, {
            ...screenData,
            inputFieldFocus: inputKey
        })(dispatch, getState);
    }
};

const onChangeTextActions = {
    setAmountInputFieldFocus
};

export const onAmountChangeTextAction = (
    module: IScreenModule,
    context: IScreenContext,
    screenKey: string
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    const data = module.data as IAmountInputData;

    if (typeof onChangeTextActions[data.onChangeTextAction.fn] === 'function') {
        onChangeTextActions[data.onChangeTextAction.fn](
            module,
            context,
            screenKey,
            data.onChangeTextAction?.params
        )(dispatch, getState);
    }
};
