import BigNumber from 'bignumber.js';
import { Dispatch } from 'react';
import { IScreenFieldValidation } from '../../../../../components/widgets/types';
import { getBlockchain } from '../../../../../core/blockchain/blockchain-factory';
import { pickInsensitiveKey } from '../../../../../core/utils/pick';
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
    const token = account.tokens[chainId][blockchainInstance.config.coin];

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
    const chainId = getChainId(state, blockchain);

    const inputAmount = inputData && inputData[field];
    const tokenSymbol = validation.params[0].tokenSymbol;

    const tokenConfig = getTokenConfig(blockchain, tokenSymbol);

    const token = pickInsensitiveKey(account.tokens[chainId], tokenSymbol);

    const availableBalance = new BigNumber(token.balance?.available || '0');

    // TODO: decide if this is needed
    // - if so, we should be for native tokens only
    // if (availableBalance.isGreaterThan(new BigNumber(0))) {
    //     availableBalance = availableBalance.minus(
    //         blockchainInstance.config.amountToKeepInAccount[account.type]
    //     );
    // }

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
