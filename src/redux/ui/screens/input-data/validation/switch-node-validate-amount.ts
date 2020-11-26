import BigNumber from 'bignumber.js';
import { cloneDeep } from 'lodash';
import { Dispatch } from 'react';
import { IScreenFieldValidation } from '../../../../../components/widgets/types';
import { getBlockchain } from '../../../../../core/blockchain/blockchain-factory';
import { formatNumber } from '../../../../../core/utils/format-number';
import { getChainId } from '../../../../preferences/selectors';
import { IReduxState } from '../../../../state';
import { getTokenConfig } from '../../../../tokens/static-selectors';
import { IAction } from '../../../../types';
import { getSelectedAccount } from '../../../../wallets/selectors';
import { setScreenInputValidation } from '../actions';

/**
 * This data is stored on screen key
 */
export const switchNodeValidateAmount = (
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

    const inputAmount = blockchainInstance.account.amountToStd(
        new BigNumber(inputData?.amount),
        tokenConfig.decimals
    );

    const flowId = validation.params[0].flowId;
    const minAmountDelegate = new BigNumber(validation.params[0].minAmountDelegate);

    const nodeAvailableAmount = new BigNumber(
        (state.ui.screens.inputData &&
            state.ui.screens.inputData[flowId]?.data?.switchNodeValidator?.availableBalance) ||
            '0'
    );

    if (
        nodeAvailableAmount.minus(minAmountDelegate).isLessThan(inputAmount) &&
        inputAmount.isLessThan(nodeAvailableAmount)
    ) {
        // Show error

        const fieldsErrors = [];

        for (const msgKey of Object.keys(validation?.messages || [])) {
            const msg = cloneDeep(validation.messages[msgKey]);
            msg.message =
                msg.message +
                ` ${formatNumber(
                    blockchainInstance.account.amountFromStd(
                        nodeAvailableAmount.minus(minAmountDelegate),
                        tokenConfig.decimals
                    ),
                    { currency: blockchainInstance.config.coin }
                )}`;
            fieldsErrors.push(msg);
        }

        setScreenInputValidation(screenKey, {
            fieldsErrors: {
                [field]: fieldsErrors
            },
            valid: false
        })(dispatch, getState);
    }
};
