import BigNumber from 'bignumber.js';
import { Dispatch } from 'react';
import { IScreenFieldValidation } from '../../../../../components/widgets/types';
import { getBlockchain } from '../../../../../core/blockchain/blockchain-factory';
import { getChainId } from '../../../../preferences/selectors';
import { IReduxState } from '../../../../state';
import { getTokenConfig } from '../../../../tokens/static-selectors';
import { IAction } from '../../../../types';
import { getSelectedAccount } from '../../../../wallets/selectors';
import { setScreenInputValidation } from '../actions';

/**
 * This data is stored on screen key
 */
export const minAmountToStake = (
    validation: IScreenFieldValidation,
    field: string,
    screenKey: string,
    getState: () => IReduxState,
    dispatch: Dispatch<IAction<any>>
) => {
    const state = getState();

    const account = getSelectedAccount(state);

    const inputData: any = state.ui.screens.inputData[screenKey]?.data;

    const blockchain = account.blockchain;
    const blockchainInstance = getBlockchain(blockchain);
    const chainId = getChainId(state, blockchain);
    const token = account.tokens[chainId][blockchainInstance.config.coin];

    const tokenConfig = getTokenConfig(blockchain, token.symbol);

    const inputAmount = inputData?.amount;
    const inputAmountToStd = blockchainInstance.account.amountToStd(
        new BigNumber(inputAmount),
        tokenConfig.decimals
    );

    const minAmountDelegate = validation.params && validation.params[0]?.minAmountDelegate;

    if (inputAmountToStd.isLessThan(minAmountDelegate)) {
        // Show error

        const fieldsErrors = [];

        for (const msgKey of Object.keys(validation?.messages || [])) {
            fieldsErrors.push(validation.messages[msgKey]);
        }

        setScreenInputValidation(screenKey, {
            fieldsErrors: {
                [field]: fieldsErrors
            },
            valid: false
        })(dispatch, getState);
    }
};

export const minAmountToStakePerValidator = (
    validation: IScreenFieldValidation,
    field: string,
    screenKey: string,
    getState: () => IReduxState,
    dispatch: Dispatch<IAction<any>>
) => {
    const state = getState();

    const account = getSelectedAccount(state);

    const inputData: any = state.ui.screens.inputData[screenKey]?.data;

    const blockchain = account.blockchain;
    const blockchainInstance = getBlockchain(blockchain);
    const chainId = getChainId(state, blockchain);
    const token = account.tokens[chainId][blockchainInstance.config.coin];

    const tokenConfig = getTokenConfig(blockchain, token.symbol);

    const minAmountDelegate = validation.params && validation.params[0]?.minAmountDelegate;

    let allFieldsAreValid = true;

    for (const inputDataKey of Object.keys(inputData || {})) {
        if (
            inputData[inputDataKey] &&
            inputData[inputDataKey]?.amount &&
            inputData[inputDataKey]?.validator
        ) {
            const amount = inputData[inputDataKey].amount;
            const amountToStd = blockchainInstance.account.amountToStd(
                new BigNumber(amount),
                tokenConfig.decimals
            );

            if (amountToStd.isLessThan(minAmountDelegate) && amountToStd.isGreaterThan(0)) {
                // Show error

                const fieldsErrors = [];

                for (const msgKey of Object.keys(validation?.messages || [])) {
                    fieldsErrors.push(validation.messages[msgKey]);
                }

                setScreenInputValidation(screenKey, {
                    fieldsErrors: {
                        [field]: fieldsErrors
                    },
                    valid: false
                })(dispatch, getState);

                allFieldsAreValid = false;
            }
        }
    }

    if (allFieldsAreValid) {
        // Valid input

        setScreenInputValidation(screenKey, {
            fieldsErrors: undefined,
            valid: true
        })(dispatch, getState);
    }
};
