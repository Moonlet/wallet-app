import { Dispatch } from 'react';
import { IScreenContext } from '../../../../../components/widgets/types';
import { getBlockchain } from '../../../../../core/blockchain/blockchain-factory';
import { IReduxState } from '../../../../state';
import { getTokenConfig } from '../../../../tokens/static-selectors';
import { IAction } from '../../../../types';
import { getSelectedBlockchain } from '../../../../wallets/selectors';
import { handleCta } from '../../data/handle-cta';
import { setScreenAmount, setScreenInputData } from '../actions';

const getSwitchNodeValidatorAmount = (
    params: any,
    context: IScreenContext,
    screenKey: string,
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    const state = getState();

    for (const param of params) {
        if (param?.flowId) {
            const amount =
                (state.ui.screens.inputData &&
                    state.ui.screens.inputData[param.flowId]?.data?.switchNodeValidator
                        ?.availableBalance) ||
                '0';

            const blockchain = getSelectedBlockchain(state);
            const blockchainConfig = getBlockchain(blockchain);

            const tokenConfig = getTokenConfig(blockchain, blockchainConfig.config.coin);

            setScreenAmount(
                blockchainConfig.account.amountFromStd(amount, tokenConfig.decimals).toFixed(),
                {
                    screenKey,
                    context
                }
            )(dispatch, getState);
        }
    }
};

const screenActionParamFn = {
    getSwitchNodeValidatorAmount
};

const setScreenAmountAction = (
    params: any,
    context: IScreenContext,
    screenKey: string,
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    for (const param of params || []) {
        if (param?.amount) {
            setScreenAmount(param.amount, {
                screenKey,
                context
            })(dispatch, getState);
        }

        if (param?.fn && typeof screenActionParamFn[param.fn] === 'function') {
            screenActionParamFn[param.fn](param.params, context, screenKey, dispatch, getState);
        }
    }
};

const setScreenAmountBox = (
    params: any,
    context: IScreenContext,
    screenKey: string,
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    setScreenInputData(screenKey, {
        amountBox: params[0]
    })(dispatch, getState);
};

const setScreenAmountPercentToMoonlet = (
    params: any,
    context: IScreenContext,
    screenKey: string,
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    handleCta(params[0], { screenKey })(dispatch, getState);
};

export const screenActions = {
    setScreenAmountAction,
    setScreenAmountBox,
    setScreenAmountPercentToMoonlet
};
