import { getChainId } from '../../../../redux/preferences/selectors';
import { IReduxState } from '../../../../redux/state';
import { getScreenDataKey } from '../../../../redux/ui/screens/data/reducer';
import { getSelectedAccount, getSelectedWallet } from '../../../../redux/wallets/selectors';
import { IScreenModule } from './../../types';

export const getSwapParamsForPrice = (state: IReduxState, module: IScreenModule) => {
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

    return {
        fromToken: state.ui.screens.inputData[screenKey]?.data?.swapFromToken,
        toToken: state.ui.screens.inputData[screenKey]?.data?.swapToToken,
        amountFromToken:
            type === 'SELL'
                ? state.ui.screens.inputData[screenKey]?.data?.swapAmountTop
                : state.ui.screens.inputData[screenKey]?.data?.swapAmountBottom
    };
};

export const getFromTokenSymbol = (
    state: IReduxState,
    module: IScreenModule,
    options: any,
    params: any
) => {
    const account = getSelectedAccount(state);
    const chainId = getChainId(state, account.blockchain);

    const step = params && params[0];

    const screenKey = getScreenDataKey({
        pubKey: getSelectedWallet(state)?.walletPublicKey,
        blockchain: account?.blockchain,
        chainId: String(chainId),
        address: account?.address,
        step,
        tab: undefined
    });

    const type: string = state.ui.screens.inputData[screenKey]?.data?.swapType;
    const fromTokenSymbol: string =
        state.ui.screens.inputData[screenKey]?.data?.swapFromToken?.symbol;
    const toTokenSymbol: string = state.ui.screens.inputData[screenKey]?.data?.swapToToken?.symbol;

    return type === 'SELL' ? fromTokenSymbol : toTokenSymbol;
};

export const getToTokenSymbol = (
    state: IReduxState,
    module: IScreenModule,
    options: any,
    params: any
) => {
    const account = getSelectedAccount(state);
    const chainId = getChainId(state, account.blockchain);

    const step = params && params[0];

    const screenKey = getScreenDataKey({
        pubKey: getSelectedWallet(state)?.walletPublicKey,
        blockchain: account?.blockchain,
        chainId: String(chainId),
        address: account?.address,
        step,
        tab: undefined
    });

    const type: string = state.ui.screens.inputData[screenKey]?.data?.swapType;
    const fromTokenSymbol: string =
        state.ui.screens.inputData[screenKey]?.data?.swapFromToken?.symbol;
    const toTokenSymbol: string = state.ui.screens.inputData[screenKey]?.data?.swapToToken?.symbol;

    return type === 'BUY' ? fromTokenSymbol : toTokenSymbol;
};

export const getFromTokenId = (
    state: IReduxState,
    module: IScreenModule,
    options: any,
    params: any
) => {
    const account = getSelectedAccount(state);
    const chainId = getChainId(state, account.blockchain);

    const step = params && params[0];

    const screenKey = getScreenDataKey({
        pubKey: getSelectedWallet(state)?.walletPublicKey,
        blockchain: account?.blockchain,
        chainId: String(chainId),
        address: account?.address,
        step,
        tab: undefined
    });

    const type: string = state.ui.screens.inputData[screenKey]?.data?.swapType;
    const fromTokenSymbol: string = state.ui.screens.inputData[screenKey]?.data?.swapFromToken?.id;
    const toTokenSymbol: string = state.ui.screens.inputData[screenKey]?.data?.swapToToken?.id;

    return type === 'SELL' ? fromTokenSymbol : toTokenSymbol;
};

export const getToTokenId = (
    state: IReduxState,
    module: IScreenModule,
    options: any,
    params: any
) => {
    const account = getSelectedAccount(state);
    const chainId = getChainId(state, account.blockchain);

    const step = params && params[0];

    const screenKey = getScreenDataKey({
        pubKey: getSelectedWallet(state)?.walletPublicKey,
        blockchain: account?.blockchain,
        chainId: String(chainId),
        address: account?.address,
        step,
        tab: undefined
    });

    const type: string = state.ui.screens.inputData[screenKey]?.data?.swapType;
    const fromTokenSymbol: string = state.ui.screens.inputData[screenKey]?.data?.swapFromToken?.id;
    const toTokenSymbol: string = state.ui.screens.inputData[screenKey]?.data?.swapToToken?.id;

    return type === 'BUY' ? fromTokenSymbol : toTokenSymbol;
};
