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

export const getFromToken = (
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

    return state.ui.screens.inputData[screenKey]?.data?.swapFromToken || '';
};

export const getToToken = (
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

    return state.ui.screens.inputData[screenKey]?.data?.swapToToken || '';
};
