import BigNumber from 'bignumber.js';
import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { convertAmount, splitStake } from '../../../../core/utils/balance';
import { formatNumber } from '../../../../core/utils/format-number';
import { IReduxState } from '../../../../redux/state';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import { getSelectedBlockchain } from '../../../../redux/wallets/selectors';
import { IScreenModule } from '../../types';

export const getInputBalanceFormat = (
    state: IReduxState,
    module: IScreenModule,
    options: { flowId: string; screenKey: string }
) => {
    const blockchainInstance = getBlockchain(getSelectedBlockchain(state));

    let balance = new BigNumber(0);

    if (
        options?.screenKey &&
        state.ui.screens.inputData &&
        state.ui.screens.inputData[options?.screenKey]?.data?.amount
    ) {
        balance = new BigNumber(state.ui.screens.inputData[options.screenKey].data.amount);
    }

    return `${balance} ${blockchainInstance.config.coin}`;
};

export const getInputBalanceConverted = (
    state: IReduxState,
    module: IScreenModule,
    options: { flowId: string; screenKey: string }
) => {
    const blockchain = getSelectedBlockchain(state);
    const blockchainInstance = getBlockchain(blockchain);

    let balance = new BigNumber(0);

    if (
        options?.screenKey &&
        state.ui.screens.inputData &&
        state.ui.screens.inputData[options?.screenKey]?.data?.amount
    ) {
        balance = new BigNumber(state.ui.screens.inputData[options.screenKey].data.amount);
    }

    const tokenConfig = getTokenConfig(blockchain, blockchainInstance.config.coin);

    const amount = convertAmount(
        blockchain,
        state.market.exchangeRates,
        blockchainInstance.account.amountToStd(balance.toFixed(4), tokenConfig.decimals).toFixed(),
        blockchainInstance.config.coin,
        state.preferences.currency,
        tokenConfig.decimals
    );

    return formatNumber(amount, {
        currency: state.preferences.currency,
        maximumFractionDigits: tokenConfig.ui.decimals || 4
    });
};

export const getStakeAmountPerValidator = (
    state: IReduxState,
    module: IScreenModule,
    options: { flowId: string; screenKey: string },
    params?: any[]
) => {
    const blockchainInstance = getBlockchain(getSelectedBlockchain(state));

    const validatorId = params && params[0] && params[0]?.validatorId;

    const nodeAmount =
        options?.screenKey &&
        state.ui.screens.inputData &&
        state.ui.screens.inputData[options.screenKey]?.data &&
        state.ui.screens.inputData[options.screenKey]?.data[validatorId];

    if (nodeAmount) {
        return `${nodeAmount.amount} ${blockchainInstance.config.coin}`;
    }

    return `0 ${blockchainInstance.config.coin}`;
};

export const getStakeAmountValidatorSplit = (
    state: IReduxState,
    module: IScreenModule,
    options: { flowId: string; screenKey: string },
    params?: any[]
) => {
    const blockchainInstance = getBlockchain(getSelectedBlockchain(state));

    const validatorsLength = params && params[0] && params[0]?.validatorsLength;

    let balance = new BigNumber(0);

    if (
        options?.screenKey &&
        state.ui.screens.inputData &&
        state.ui.screens.inputData[options?.screenKey]?.data?.amount
    ) {
        balance = new BigNumber(state.ui.screens.inputData[options.screenKey].data.amount);
    }

    return `${splitStake(balance, validatorsLength).toFixed(2)} ${blockchainInstance.config.coin}`;
};
