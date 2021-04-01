import BigNumber from 'bignumber.js';
import { Dispatch } from 'react';
import {
    IAmountInputData,
    IScreenContext,
    IScreenModule,
    IScreenValidation,
    IStateSelector
} from '../../../../components/widgets/types';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
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

const setSwapInputAmount = (
    module: IScreenModule,
    context: IScreenContext,
    screenKey: string,
    params: any[]
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    const state = getState();
    const blockchain = getSelectedBlockchain(state);

    // TODO: this need a little refactor
    //      1. has to be supported by handle cta callAction
    //      2. not working properly when enter amount on the second input

    const inputKey = module?.details?.inputKey;
    const toInput = module?.details?.toInput;
    const priceKey = module?.details?.priceKey;

    const screenData =
        screenKey && state.ui.screens.inputData && state.ui.screens.inputData[screenKey]?.data;

    if (screenKey && screenData && inputKey && toInput) {
        const inputAmount = screenData[inputKey];

        // console.log('%%% priceKey', priceKey);

        const swapPrice =
            screenData?.swapPrice?.price && screenData?.swapPrice?.price[priceKey]?.price;

        // console.log('**', screenData?.swapPrice);

        // console.log('>>>>>>> !!!!', swapPrice);

        const swapToTokenDecimals = screenData?.swapToTokenDecimals;

        const blockchainInstance = getBlockchain(blockchain);

        let amountFromStd = new BigNumber(0);

        if (inputKey === 'swapAmountFrom') {
            // swapAmountFrom
            amountFromStd = blockchainInstance.account.amountFromStd(
                new BigNumber(inputAmount).multipliedBy(new BigNumber(swapPrice)),
                swapToTokenDecimals
            );
        } else {
            // swapAmountTo
            // console.log('## koko ##');
            amountFromStd = blockchainInstance.account
                .amountToStd(inputAmount, swapToTokenDecimals)
                .dividedBy(new BigNumber(swapPrice));
        }

        const options = {
            screenKey,
            context,
            inputKey: toInput
        };

        if (isNaN(amountFromStd.toNumber())) {
            setScreenAmount('', options)(dispatch, getState);
        } else {
            setScreenAmount(amountFromStd.toFixed(), options)(dispatch, getState);
        }
    }
};

const onChangeTextActions = {
    setSwapInputAmount
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
