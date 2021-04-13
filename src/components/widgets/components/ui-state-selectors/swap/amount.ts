import { SwapType } from '../../../../../core/blockchain/types/token';
import { getChainId } from '../../../../../redux/preferences/selectors';
import { IReduxState } from '../../../../../redux/state';
import { getScreenDataKey } from '../../../../../redux/ui/screens/data/reducer';
import { getSelectedAccount, getSelectedWallet } from '../../../../../redux/wallets/selectors';
import { IScreenModule } from './../../../types';

export const getSwapToken1Amount = (
    state: IReduxState,
    module: IScreenModule,
    options: {
        screenKey: string;
    },
    params: any
) => {
    let screenKey = options?.screenKey;

    if (module?.details?.step) {
        const account = getSelectedAccount(state);
        const chainId = getChainId(state, account.blockchain);

        screenKey = getScreenDataKey({
            pubKey: getSelectedWallet(state)?.walletPublicKey,
            blockchain: account?.blockchain,
            chainId: String(chainId),
            address: account?.address,
            step: module.details.step,
            tab: undefined
        });
    }

    const type = state.ui.screens.inputData[screenKey]?.data?.swapType;

    const token1Amount = state.ui.screens.inputData[screenKey]?.data?.swapToken1Amount;
    const token2Amount = state.ui.screens.inputData[screenKey]?.data?.swapToken2Amount;

    return type === SwapType.SELL ? token1Amount : token2Amount;
};

export const getSwapToken2Amount = (
    state: IReduxState,
    module: IScreenModule,
    options: {
        screenKey: string;
    },
    params: any
) => {
    let screenKey = options?.screenKey;

    if (module?.details?.step) {
        const account = getSelectedAccount(state);
        const chainId = getChainId(state, account.blockchain);

        screenKey = getScreenDataKey({
            pubKey: getSelectedWallet(state)?.walletPublicKey,
            blockchain: account?.blockchain,
            chainId: String(chainId),
            address: account?.address,
            step: module.details.step,
            tab: undefined
        });
    }

    const type = state.ui.screens.inputData[screenKey]?.data?.swapType;

    const token1Amount = state.ui.screens.inputData[screenKey]?.data?.swapToken1Amount;
    const token2Amount = state.ui.screens.inputData[screenKey]?.data?.swapToken2Amount;

    return type === SwapType.BUY ? token1Amount : token2Amount;
};

export const getSwapToken2SwapPriceAmount = (
    state: IReduxState,
    module: IScreenModule,
    options: {
        screenKey: string;
    },
    params: any
) => {
    let screenKey = options.screenKey;

    if (module?.details?.step) {
        const account = getSelectedAccount(state);
        const chainId = getChainId(state, account.blockchain);

        screenKey = getScreenDataKey({
            pubKey: getSelectedWallet(state)?.walletPublicKey,
            blockchain: account?.blockchain,
            chainId: String(chainId),
            address: account?.address,
            step: module.details.step,
            tab: undefined
        });
    }

    const screenData = state.ui.screens.inputData[screenKey].data;

    const token2Amount = screenData.swapPrice.token2Amount;

    return token2Amount;
};
