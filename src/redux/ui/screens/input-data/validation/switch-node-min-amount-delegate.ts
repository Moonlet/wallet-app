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
export const switchNodeMinAmountDelegate = (
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

    const minAmountDelegate = new BigNumber(
        (validation?.params && validation?.params[0]?.minAmountDelegate) || '10000000000000'
    );

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
