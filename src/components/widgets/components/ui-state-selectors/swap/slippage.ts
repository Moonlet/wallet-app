import { getChainId } from '../../../../../redux/preferences/selectors';
import { IReduxState } from '../../../../../redux/state';
import { getScreenDataKey } from '../../../../../redux/ui/screens/data/reducer';
import { getSelectedAccount, getSelectedWallet } from '../../../../../redux/wallets/selectors';
import { IScreenModule } from './../../../types';

export const getSwapCustomSlippage = (
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

    return (
        state.ui.screens.inputData && state.ui.screens.inputData[screenKey]?.data?.customSlippage
    );
};
