import { formatNumber } from '../../../../../core/utils/format-number';
import { IReduxState } from '../../../../../redux/state';
import { IScreenModule } from '../../../types';

export const getSwapToken1MaxBalance = (
    state: IReduxState,
    module: IScreenModule,
    options: {
        screenKey: string;
    },
    params: any
) => {
    const screenKey = options?.screenKey;

    const screenData =
        screenKey && state.ui.screens.inputData && state.ui.screens.inputData[screenKey]?.data;

    const balance = screenData?.maxBalance?.token1;
    const symbol = screenData?.swapToken1?.symbol;

    if (balance && symbol) {
        return formatNumber(balance, {
            currency: symbol,
            maximumFractionDigits: (params && params[0]?.decimals) || 6
        });
    }

    return '...';
};

export const getSwapToken2MaxBalance = (
    state: IReduxState,
    module: IScreenModule,
    options: {
        screenKey: string;
    },
    params: any
) => {
    const screenKey = options?.screenKey;

    const screenData =
        screenKey && state.ui.screens.inputData && state.ui.screens.inputData[screenKey]?.data;

    const balance = screenData?.maxBalance?.token2;
    const symbol = screenData?.swapToken2?.symbol;

    if (balance && symbol) {
        return formatNumber(balance, {
            currency: symbol,
            maximumFractionDigits: (params && params[0]?.decimals) || 6
        });
    }

    return '...';
};
