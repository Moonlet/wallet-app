import { SwapType } from '../../../../../core/blockchain/types/token';
import { getChainId } from '../../../../../redux/preferences/selectors';
import { IReduxState } from '../../../../../redux/state';
import { getScreenDataKey } from '../../../../../redux/ui/screens/data/reducer';
import { getSelectedAccount, getSelectedWallet } from '../../../../../redux/wallets/selectors';
import { IScreenModule, IScreenModuleWrapperData } from '../../../types';

export const swapToggleSelector = (state: IReduxState, module: IScreenModule): string => {
    const wrapper = module.data as IScreenModuleWrapperData;

    const account = getSelectedAccount(state);
    const chainId = getChainId(state, account.blockchain);

    const step = wrapper?.data?.SELL?.details?.step;

    const screenKey = getScreenDataKey({
        pubKey: getSelectedWallet(state)?.walletPublicKey,
        blockchain: account?.blockchain,
        chainId: String(chainId),
        address: account?.address,
        step,
        tab: undefined
    });

    if (
        screenKey &&
        state.ui.screens.inputData &&
        state.ui.screens.inputData[screenKey] &&
        state.ui.screens.inputData[screenKey]?.data &&
        state.ui.screens.inputData[screenKey]?.data.swapType
    ) {
        return state.ui.screens.inputData[screenKey]?.data.swapType;
    }

    return SwapType.SELL;
};

export const swapToEnterAmount = (
    state: IReduxState,
    module: IScreenModule,
    screenKey: string
): string => {
    const wrapper = module.data as IScreenModuleWrapperData;

    if (
        screenKey &&
        state.ui.screens.inputData &&
        state.ui.screens.inputData[screenKey] &&
        state.ui.screens.inputData[screenKey]?.validation &&
        state.ui.screens.inputData[screenKey]?.validation?.valid === true
    ) {
        return 'DEFAULT';
    }

    return wrapper.state;
};

export const swapToCustomSlippageBox = (
    state: IReduxState,
    module: IScreenModule,
    screenKey: string
): string => {
    const wrapper = module.data as IScreenModuleWrapperData;

    const customSlippage = wrapper?.data?.DEFAULT?.details?.customSlippage;

    if (
        screenKey &&
        state.ui.screens.inputData &&
        state.ui.screens.inputData[screenKey] &&
        state.ui.screens.inputData[screenKey]?.data?.customSlippage === customSlippage
    ) {
        return 'SELECTED';
    }

    return wrapper.state;
};
