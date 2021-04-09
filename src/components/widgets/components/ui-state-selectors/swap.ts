import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { SwapType } from '../../../../core/blockchain/types/token';
import { formatNumber } from '../../../../core/utils/format-number';
import { getChainId } from '../../../../redux/preferences/selectors';
import { IReduxState } from '../../../../redux/state';
import { getScreenDataKey } from '../../../../redux/ui/screens/data/reducer';
import {
    getSelectedAccount,
    getSelectedBlockchain,
    getSelectedWallet
} from '../../../../redux/wallets/selectors';
import { IScreenModule } from './../../types';

export const getFromTokenSymbol = (
    state: IReduxState,
    module: IScreenModule,
    options: any,
    params: any
) => {
    const account = getSelectedAccount(state);
    const chainId = getChainId(state, account.blockchain);

    const screenKey = getScreenDataKey({
        pubKey: getSelectedWallet(state)?.walletPublicKey,
        blockchain: account?.blockchain,
        chainId: String(chainId),
        address: account?.address,
        step: module?.details?.step,
        tab: undefined
    });

    const type: string = state.ui.screens.inputData[screenKey]?.data?.swapType;
    const fromTokenSymbol: string =
        state.ui.screens.inputData[screenKey]?.data?.swapFromToken?.symbol;
    const toTokenSymbol: string = state.ui.screens.inputData[screenKey]?.data?.swapToToken?.symbol;

    return type === SwapType.SELL ? fromTokenSymbol : toTokenSymbol;
};

export const getToTokenSymbol = (
    state: IReduxState,
    module: IScreenModule,
    options: any,
    params: any
) => {
    const account = getSelectedAccount(state);
    const chainId = getChainId(state, account.blockchain);

    const screenKey = getScreenDataKey({
        pubKey: getSelectedWallet(state)?.walletPublicKey,
        blockchain: account?.blockchain,
        chainId: String(chainId),
        address: account?.address,
        step: module?.details?.step,
        tab: undefined
    });

    const type: string = state.ui.screens.inputData[screenKey]?.data?.swapType;
    const fromTokenSymbol: string =
        state.ui.screens.inputData[screenKey]?.data?.swapFromToken?.symbol;
    const toTokenSymbol: string = state.ui.screens.inputData[screenKey]?.data?.swapToToken?.symbol;

    return type === SwapType.BUY ? fromTokenSymbol : toTokenSymbol;
};

export const getFromAmount = (
    state: IReduxState,
    module: IScreenModule,
    options: any,
    params: any
) => {
    const account = getSelectedAccount(state);
    const chainId = getChainId(state, account.blockchain);

    const screenKey = getScreenDataKey({
        pubKey: getSelectedWallet(state)?.walletPublicKey,
        blockchain: account?.blockchain,
        chainId: String(chainId),
        address: account?.address,
        step: module?.details?.step,
        tab: undefined
    });

    const type: string = state.ui.screens.inputData[screenKey]?.data?.swapType;
    const amountFrom: string = state.ui.screens.inputData[screenKey]?.data?.swapAmountFrom;
    const amountTo: string = state.ui.screens.inputData[screenKey]?.data?.swapAmountTo;

    return type === SwapType.SELL ? amountFrom : amountTo;
};

export const getToAmount = (
    state: IReduxState,
    module: IScreenModule,
    options: any,
    params: any
) => {
    const account = getSelectedAccount(state);
    const chainId = getChainId(state, account.blockchain);

    const screenKey = getScreenDataKey({
        pubKey: getSelectedWallet(state)?.walletPublicKey,
        blockchain: account?.blockchain,
        chainId: String(chainId),
        address: account?.address,
        step: module?.details?.step,
        tab: undefined
    });

    const type: string = state.ui.screens.inputData[screenKey]?.data?.swapType;
    const amountFrom: string = state.ui.screens.inputData[screenKey]?.data?.swapAmountFrom;
    const amountTo: string = state.ui.screens.inputData[screenKey]?.data?.swapAmountTo;

    return type === SwapType.BUY ? amountFrom : amountTo;
};

export const getSwapFromToken = (
    state: IReduxState,
    module: IScreenModule,
    options: {
        screenKey: string;
    },
    params: any
): string => {
    const screenKey = options?.screenKey;

    const blockchain = getSelectedBlockchain(state);

    const screenData = state.ui.screens.inputData[screenKey]?.data;

    const swapType = screenData?.swapType;
    const swapFromToken = screenData?.swapFromToken;
    const swapToToken = screenData?.swapToToken;

    const symbol: string = swapType === SwapType.SELL ? swapFromToken?.symbol : swapToToken?.symbol;

    return `${blockchain?.toUpperCase()}:${symbol?.toUpperCase()}`;
};

export const getSwapFromTokenAmount = (
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
    const swapFromToken = screenData?.swapFromToken;
    const swapToToken = screenData?.swapToToken;
    const inputFieldFocus = screenData?.inputFieldFocus;

    // return '' if it's not the focused input
    // - used to handle in api
    if (swapType === SwapType.SELL) {
        if (inputFieldFocus !== 'swapAmountFrom') return '';
    }
    if (swapType === SwapType.BUY) {
        if (inputFieldFocus === 'swapAmountFrom') return '';
    }

    const decimals = swapType === SwapType.SELL ? swapFromToken?.decimals : swapToToken?.decimals;

    const amount =
        swapType === SwapType.SELL
            ? state.ui.screens.inputData[screenKey]?.data?.swapAmountFrom || '1'
            : state.ui.screens.inputData[screenKey]?.data?.swapAmountTo || '1';

    return blockchainInstance.account.amountToStd(amount, decimals).toFixed();
};

export const getSwapToToken = (
    state: IReduxState,
    module: IScreenModule,
    options: {
        screenKey: string;
    },
    params: any[]
): string => {
    const screenKey = options?.screenKey;

    const blockchain = getSelectedBlockchain(state);

    const screenData = state.ui.screens.inputData[screenKey]?.data;

    const swapType = screenData?.swapType;
    const swapFromToken = screenData?.swapFromToken;
    const swapToToken = screenData?.swapToToken;

    const symbol: string = swapType === SwapType.BUY ? swapFromToken?.symbol : swapToToken?.symbol;

    return `${blockchain?.toUpperCase()}:${symbol?.toUpperCase()}`;
};

export const getSwapToTokenAmount = (
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
    const swapFromToken = screenData?.swapFromToken;
    const swapToToken = screenData?.swapToToken;

    const inputFieldFocus = screenData?.inputFieldFocus;

    // return '' if it's not the focused input
    // - used to handle in api
    if (swapType === SwapType.SELL) {
        if (inputFieldFocus !== 'swapAmountTo') return '';
    }
    if (swapType === SwapType.BUY) {
        if (inputFieldFocus === 'swapAmountTo') return '';
    }

    const decimals = swapType === SwapType.BUY ? swapFromToken?.decimals : swapToToken?.decimals;

    const amount =
        swapType === SwapType.BUY
            ? state.ui.screens.inputData[screenKey]?.data?.swapAmountFrom || '1'
            : state.ui.screens.inputData[screenKey]?.data?.swapAmountTo || '1';

    return blockchainInstance.account.amountToStd(amount, decimals).toFixed();
};

export const getSwapPrice = (
    state: IReduxState,
    module: IScreenModule,
    options: {
        screenKey: string;
    },
    params: any
) => {
    const account = getSelectedAccount(state);
    const chainId = getChainId(state, account.blockchain);

    const screenKey = getScreenDataKey({
        pubKey: getSelectedWallet(state)?.walletPublicKey,
        blockchain: account?.blockchain,
        chainId: String(chainId),
        address: account?.address,
        step: module?.details?.step,
        tab: undefined
    });

    const screenData = state.ui.screens.inputData[screenKey]?.data;

    const rate = screenData?.swapPrice?.rate;

    if (!rate) return '...';

    return formatNumber(rate, { maximumFractionDigits: 6 });
};

export const getPriceUpdateTimer = (
    state: IReduxState,
    module: IScreenModule,
    options: {
        screenKey: string;
    },
    params: any
) => {
    const screenKey = options.screenKey;

    const screenData = state.ui.screens.inputData[screenKey]?.data;

    if (screenData?.priceUpdateTimer === undefined) return '';

    const timeLeft: number = Number(screenData?.priceUpdateTimer);

    return `${Math.floor(timeLeft / 60)}:${timeLeft % 60}`;
};
