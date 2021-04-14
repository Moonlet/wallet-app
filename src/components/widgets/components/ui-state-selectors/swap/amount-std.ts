import { getBlockchain } from '../../../../../core/blockchain/blockchain-factory';
import { SwapType } from '../../../../../core/blockchain/types/token';
import { IReduxState } from '../../../../../redux/state';
import { getSelectedAccount } from '../../../../../redux/wallets/selectors';
import { IScreenModule } from '../../../types';

export const getSwapToken1AmountStd = (
    state: IReduxState,
    module: IScreenModule,
    options: {
        screenKey: string;
    },
    params: any
) => {
    const screenKey = options?.screenKey;

    const account = getSelectedAccount(state);
    const blockchainInstance = getBlockchain(account.blockchain);

    const screenData = state.ui.screens.inputData[screenKey]?.data;

    const swapType = screenData?.swapType;

    const swapToken1 = screenData?.swapToken1;
    const swapToken2 = screenData?.swapToken2;

    const inputFieldFocus = screenData?.inputFieldFocus;

    // return '' if it's not the focused input
    // - used to handle in api
    if (swapType === SwapType.SELL) {
        if (inputFieldFocus !== 'swapToken1Amount') return '';
    }
    if (swapType === SwapType.BUY) {
        if (inputFieldFocus === 'swapToken1Amount') return '';
    }

    const decimals = swapType === SwapType.SELL ? swapToken1?.decimals : swapToken2?.decimals;

    const amount =
        swapType === SwapType.SELL
            ? state.ui.screens.inputData[screenKey]?.data?.swapToken1Amount || '1'
            : state.ui.screens.inputData[screenKey]?.data?.swapToken2Amount || '1';

    return blockchainInstance.account.amountToStd(amount, decimals).toFixed();
};

export const getSwapToken2AmountStd = (
    state: IReduxState,
    module: IScreenModule,
    options: {
        screenKey: string;
    },
    params: any
): string => {
    const screenKey = options?.screenKey;

    const account = getSelectedAccount(state);
    const blockchainInstance = getBlockchain(account.blockchain);

    const screenData = state.ui.screens.inputData[screenKey]?.data;

    const swapType = screenData?.swapType;
    const swapToken1 = screenData?.swapToken1;
    const swapToken2 = screenData?.swapToken2;

    const inputFieldFocus = screenData?.inputFieldFocus;

    // return '' if it's not the focused input
    // - used to handle in api
    if (swapType === SwapType.SELL) {
        if (inputFieldFocus !== 'swapToken2Amount') return '';
    }
    if (swapType === SwapType.BUY) {
        if (inputFieldFocus === 'swapToken2Amount') return '';
    }

    const decimals = swapType === SwapType.BUY ? swapToken1?.decimals : swapToken2?.decimals;

    const amount =
        swapType === SwapType.BUY
            ? state.ui.screens.inputData[screenKey]?.data?.swapToken1Amount || '1'
            : state.ui.screens.inputData[screenKey]?.data?.swapToken2Amount || '1';

    return blockchainInstance.account.amountToStd(amount, decimals).toFixed();
};
