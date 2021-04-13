import { SwapType } from '../../../../../core/blockchain/types/token';
import { IReduxState } from '../../../../../redux/state';
import { getSelectedBlockchain } from '../../../../../redux/wallets/selectors';
import { IScreenModule } from './../../../types';

export const getSwapToken1BlockchainSymbol = (
    state: IReduxState,
    module: IScreenModule,
    options: {
        screenKey: string;
    },
    params: any
): string => {
    const screenKey = options?.screenKey;

    const blockchain = getSelectedBlockchain(state);

    const screenData = state.ui.screens.inputData[screenKey].data;

    const swapType = screenData?.swapType;

    const swapToken1 = screenData?.swapToken1;
    const swapToken2 = screenData?.swapToken2;

    const symbol = swapType === SwapType.SELL ? swapToken1?.symbol : swapToken2?.symbol;

    return `${blockchain?.toUpperCase()}:${symbol?.toUpperCase()}`;
};

export const getSwapToken2BlockchainSymbol = (
    state: IReduxState,
    module: IScreenModule,
    options: {
        screenKey: string;
    },
    params: any[]
): string => {
    const screenKey = options?.screenKey;

    const blockchain = getSelectedBlockchain(state);

    const screenData = state.ui.screens.inputData[screenKey].data;

    const swapType = screenData?.swapType;

    const swapToken1 = screenData?.swapToken1;
    const swapToken2 = screenData?.swapToken2;

    const symbol = swapType === SwapType.BUY ? swapToken1?.symbol : swapToken2?.symbol;

    return `${blockchain?.toUpperCase()}:${symbol?.toUpperCase()}`;
};
