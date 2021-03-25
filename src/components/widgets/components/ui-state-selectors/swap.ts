import { getBlockchain } from '../../../../core/blockchain/blockchain-factory';
import { getChainId } from '../../../../redux/preferences/selectors';
import { IReduxState } from '../../../../redux/state';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import { getScreenDataKey } from '../../../../redux/ui/screens/data/reducer';
import { getSelectedAccount, getSelectedWallet } from '../../../../redux/wallets/selectors';
import { IScreenModule } from './../../types';

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
    const fromTokenId: string = state.ui.screens.inputData[screenKey]?.data?.swapFromToken?.id;
    const toTokenId: string = state.ui.screens.inputData[screenKey]?.data?.swapToToken?.id;

    return type === 'SELL' ? fromTokenId : toTokenId;
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
    const fromTokenId: string = state.ui.screens.inputData[screenKey]?.data?.swapFromToken?.id;
    const toTokenId: string = state.ui.screens.inputData[screenKey]?.data?.swapToToken?.id;

    return type === 'BUY' ? fromTokenId : toTokenId;
};

export const getUnitAmount = (
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

    const tokenSymbol =
        type === 'SELL'
            ? getFromTokenSymbol(state, module, options, params)
            : getToTokenSymbol(state, module, options, params);

    if (tokenSymbol) {
        const blockchainInstance = getBlockchain(account.blockchain);
        const tokenConfig = getTokenConfig(account.blockchain, tokenSymbol);
        return blockchainInstance.account.amountToStd('1', tokenConfig.decimals).toFixed();
    }
    return '';
};

export const getFromAmount = (
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
    const amountFrom: string = state.ui.screens.inputData[screenKey]?.data?.swapAmountFrom;
    const amountTo: string = state.ui.screens.inputData[screenKey]?.data?.swapAmountTo;

    return type === 'SELL' ? amountFrom : amountTo;
};

export const getToAmount = (
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
    const amountFrom: string = state.ui.screens.inputData[screenKey]?.data?.swapAmountFrom;
    const amountTo: string = state.ui.screens.inputData[screenKey]?.data?.swapAmountTo;

    return type === 'BUY' ? amountFrom : amountTo;
};
