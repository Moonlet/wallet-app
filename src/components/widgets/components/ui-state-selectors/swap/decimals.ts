import { SwapType } from '../../../../../core/blockchain/types/token';
import { getChainId } from '../../../../../redux/preferences/selectors';
import { IReduxState } from '../../../../../redux/state';
import { getScreenDataKey } from '../../../../../redux/ui/screens/data/reducer';
import { getSelectedAccount, getSelectedWallet } from '../../../../../redux/wallets/selectors';
import { IScreenModule } from './../../../types';

export const getSwapToken2Decimals = (
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

    const swapType = screenData?.swapType;

    const swapToken1 = screenData?.swapToken1;
    const swapToken2 = screenData?.swapToken2;

    return swapType === SwapType.SELL ? swapToken1?.decimals : swapToken2?.decimals;
};
