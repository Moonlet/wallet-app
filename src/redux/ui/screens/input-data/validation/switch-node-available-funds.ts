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

export const switchNodeAvailableFunds = (
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

    const flowId = validation.params[0].flowId;

    const nodeAvailableAmount = new BigNumber(
        (state.ui.screens.inputData &&
            state.ui.screens.inputData[flowId]?.data?.switchNodeValidator?.availableBalance) ||
            '0'
    );

    const inputAmount = blockchainInstance.account.amountToStd(
        new BigNumber(inputData?.amount),
        tokenConfig.decimals
    );

    if (inputAmount.isGreaterThan(nodeAvailableAmount)) {
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
