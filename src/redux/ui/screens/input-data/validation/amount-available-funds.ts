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
export const amountAvailableFunds = (
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

    const tokenSymbol =
        (validation.params && validation.params[0]) || blockchainInstance.config.coin;
    const token = account.tokens[chainId][tokenSymbol];

    const tokenConfig = getTokenConfig(blockchain, token.symbol);

    let availableBalance = new BigNumber(token.balance?.available || '0');

    if (availableBalance.isGreaterThan(new BigNumber(0))) {
        availableBalance = availableBalance.minus(
            blockchainInstance.config.amountToKeepInAccount[account.type]
        );
    }

    const inputAmount = inputData?.amount;
    const inputAmountToStd = blockchainInstance.account.amountToStd(
        new BigNumber(inputAmount),
        tokenConfig.decimals
    );

    const regexMultipleDots = /(\..*){2,}/;

    if (inputAmountToStd.isGreaterThan(availableBalance) || regexMultipleDots.test(inputAmount)) {
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
    } else {
        // Valid input

        setScreenInputValidation(screenKey, {
            fieldsErrors: undefined,
            valid: true
        })(dispatch, getState);
    }
};

export const amountAvailableFundsToken = (
    validation: IScreenFieldValidation,
    field: string,
    screenKey: string,
    getState: () => IReduxState,
    dispatch: Dispatch<IAction<any>>
) => {
    const state = getState();

    const account = getSelectedAccount(state);

    const inputData = state.ui.screens.inputData[screenKey]?.data;

    const blockchain = account.blockchain;
    const blockchainInstance = getBlockchain(blockchain);

    const tokenSymbol = validation.params[0].tokenSymbol;
    const balance = new BigNumber(validation.params[0].balance);
    const swapType = validation.params[0]?.swapType;

    const inputAmount = inputData && inputData[field];

    const tokenConfig = getTokenConfig(blockchain, tokenSymbol);

    const screenValidations = state.ui.screens.inputData[screenKey]?.validation;
    const fieldsErrors = screenValidations?.fieldsErrors;
    let errors = (fieldsErrors && fieldsErrors[field]) || [];

    if (
        swapType &&
        state.ui.screens.inputData[screenKey]?.data?.swapType &&
        swapType !== state.ui.screens.inputData[screenKey]?.data?.swapType
    ) {
        // ignore this validations
        return;
    }

    const inputAmountToStd = blockchainInstance.account.amountToStd(
        new BigNumber(inputAmount),
        tokenConfig.decimals
    );

    if (inputAmountToStd.isGreaterThan(balance) || inputAmountToStd.isLessThanOrEqualTo(0)) {
        // Show error
        for (const msgKey of Object.keys(validation?.messages || [])) {
            const msg = validation.messages[msgKey] as any;
            // Make sure don't duplicate error messages
            let alreadyAdded = false;
            for (const error of errors || []) {
                if (JSON.stringify(error) === JSON.stringify(msg)) {
                    alreadyAdded = true;
                }
            }
            if (!alreadyAdded) errors.push(msg);
        }
    } else {
        // cleanup error messages
        errors = undefined;
    }

    if (errors === undefined || errors?.length === 0) {
        // All fields are valid => Validate Screen
        setScreenInputValidation(screenKey, {
            fieldsErrors: undefined,
            valid: true
        })(dispatch, getState);
    } else {
        // Set fields errors
        setScreenInputValidation(screenKey, {
            fieldsErrors: {
                ...fieldsErrors,
                [field]: errors
            },
            valid: false
        })(dispatch, getState);
    }
};
