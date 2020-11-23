import BigNumber from 'bignumber.js';
import { Dispatch } from 'react';
import { IScreenFieldValidation } from '../../../../../components/widgets/types';
import { getBlockchain } from '../../../../../core/blockchain/blockchain-factory';
import { getChainId } from '../../../../preferences/selectors';
import { IReduxState } from '../../../../state';
import { getTokenConfig } from '../../../../tokens/static-selectors';
import { IAction } from '../../../../types';
import { getSelectedAccount } from '../../../../wallets/selectors';
import { setScreenInputData } from '../actions';

export const amountAvailableFundsToKeep = (
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
