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
export const amountAvailableFundsToKeep = (
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
    const minimumAmountToKeep = blockchainInstance.config.amountToKeepInAccount[account.type];

    if (availableBalance.isGreaterThan(new BigNumber(0))) {
        availableBalance = availableBalance.minus(minimumAmountToKeep);
    }

    const inputAmount = inputData?.amount;
    const inputAmountToStd = blockchainInstance.account.amountToStd(
        new BigNumber(inputAmount),
        tokenConfig.decimals
    );

    if (
        availableBalance.isLessThan(inputAmountToStd) &&
        inputAmountToStd.isLessThan(availableBalance.plus(minimumAmountToKeep))
    ) {
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
