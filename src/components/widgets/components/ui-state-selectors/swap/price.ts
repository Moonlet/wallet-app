import { formatNumber } from '../../../../../core/utils/format-number';
import { getChainId } from '../../../../../redux/preferences/selectors';
import { IReduxState } from '../../../../../redux/state';
import { getScreenDataKey } from '../../../../../redux/ui/screens/data/reducer';
import { getSelectedAccount, getSelectedWallet } from '../../../../../redux/wallets/selectors';
import { IScreenModule } from './../../../types';

export const getSwapPriceRateFormat = (
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

    const screenData = state.ui.screens.inputData[screenKey]?.data;

    const rate = screenData?.swapPrice?.rate;

    if (!rate) return '...';

    return formatNumber(rate, { maximumFractionDigits: 6 });
};

export const getSwapPriceUpdateTimer = (
    state: IReduxState,
    module: IScreenModule,
    options: {
        screenKey: string;
    },
    params: any
) => {
    const screenKey = options.screenKey;

    const screenData = state.ui.screens.inputData[screenKey]?.data;

    if (screenData?.priceUpdateTimer === undefined) return '__:__';

    const timeLeft = Number(screenData.priceUpdateTimer);

    const minutes = Number(Math.floor(timeLeft / 60)).toLocaleString(undefined, {
        minimumIntegerDigits: 2
    });

    const seconds = Number(timeLeft % 60).toLocaleString(undefined, {
        minimumIntegerDigits: 2
    });

    return `${minutes}:${seconds}`;
};
