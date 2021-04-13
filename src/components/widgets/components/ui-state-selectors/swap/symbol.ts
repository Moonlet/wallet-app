import { SwapType } from '../../../../../core/blockchain/types/token';
import { getChainId } from '../../../../../redux/preferences/selectors';
import { IReduxState } from '../../../../../redux/state';
import { getScreenDataKey } from '../../../../../redux/ui/screens/data/reducer';
import { getSelectedAccount, getSelectedWallet } from '../../../../../redux/wallets/selectors';
import { IScreenModule } from './../../../types';

export const getSwapToken1Symbol = (
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

    const token1Symbol = state.ui.screens.inputData[screenKey]?.data?.swapToken1?.symbol;
    const token2Symbol = state.ui.screens.inputData[screenKey]?.data?.swapToken2?.symbol;

    return type === SwapType.SELL ? token1Symbol : token2Symbol;
};

export const getSwapToken2Symbol = (
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

    const token1Symbol = state.ui.screens.inputData[screenKey]?.data?.swapToken1?.symbol;
    const token2Symbol = state.ui.screens.inputData[screenKey]?.data?.swapToken2?.symbol;

    return type === SwapType.BUY ? token1Symbol : token2Symbol;
};
