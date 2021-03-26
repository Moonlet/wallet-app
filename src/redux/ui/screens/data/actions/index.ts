import { Dispatch } from 'react';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
    ICtaAction,
    IScreenContext,
    IScreenCtaResponse,
    IScreenRequest,
    SmartScreenPubSubEvents
} from '../../../../../components/widgets/types';
import { PubSub } from '../../../../../core/blockchain/common/pub-sub';
import { ApiClient } from '../../../../../core/utils/api-client/api-client';
import { getChainId } from '../../../../preferences/selectors';
import { IReduxState } from '../../../../state';
import { IAction } from '../../../../types';
import { flattenObject } from '../../../../utils/helpers';
import { getSelectedWallet, getSelectedAccount } from '../../../../wallets/selectors';
import { setScreenInputData } from '../../input-data/actions';
import { handleCta } from '../handle-cta';
import * as transactions from './transactions';

export interface IHandleCtaOptions {
    screenKey?: string;
    /** @deprecated - should remove validator */
    validator?: {
        id: string;
        name: string;
        icon?: string;
        website?: string;
    };
    pubSub?: PubSub<SmartScreenPubSubEvents>;
}

export interface IHandleCtaActionContext<P = any> {
    action: ICtaAction<P>;
    options?: IHandleCtaOptions;
}

export const handleDynamicCta = async (
    // context: IHandleCtaActionContext<transactions.IContractCallParams>
    context: IScreenContext,
    params: any,
    screenKey: string
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    const state = getState();
    const wallet = getSelectedWallet(state);
    if (!wallet) return;
    const account = getSelectedAccount(state);
    if (!account) return;
    const chainId = getChainId(state, account.blockchain);
    if (!chainId || chainId === '') return;

    const apiClient = new ApiClient();

    // let param: IScreenCtaContextParams = {};

    const body: IScreenRequest = {
        context: {
            screen: context.screen,
            step: context?.step,
            tab: context?.tab,
            flowId: context?.flowId,
            params: context.params
        },
        user: {
            os: Platform.OS as 'ios' | 'android' | 'web',
            deviceId: state.preferences.deviceId,
            preferedCurrency: state.preferences.currency,
            appVersion: DeviceInfo.getVersion(),
            theme: 'dark',
            lang: 'en',

            wallet: {
                pubKey: wallet.walletPublicKey,
                type: wallet.type
            },

            blockchain: account.blockchain,
            chainId: String(chainId),
            address: account.address,
            accountType: account.type
        }
    };

    try {
        const screenResponse = await apiClient.http.post('/walletUi/screen/cta', body);
        const data: IScreenCtaResponse = screenResponse?.result?.data;

        handleCta(data.cta, {})(dispatch, getState);
    } catch (erorr) {
        // TODO: handle error
    }
};

export const setReduxScreenInputData = (
    context: IHandleCtaActionContext<transactions.IContractCallParams>
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    setScreenInputData(context.options.screenKey, context.action.params?.params)(
        dispatch,
        getState
    );
};

export const supportedActions = flattenObject({
    transactions,
    setReduxScreenInputData,
    handleDynamicCta
});
