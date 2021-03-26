import { Dispatch } from 'react';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
    ICtaAction,
    IScreenContext,
    IScreenCtaContextParams,
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
import {
    addBreadcrumb as SentryAddBreadcrumb,
    captureException as SentryCaptureException
} from '@sentry/react-native';

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

export const handleDynamicCta = (
    context: IHandleCtaActionContext<{
        ctaId: string;
        context: IScreenContext;
    }>
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    const state = getState();
    const wallet = getSelectedWallet(state);
    if (!wallet) return;
    const account = getSelectedAccount(state);
    if (!account) return;
    const chainId = getChainId(state, account.blockchain);
    if (!chainId || chainId === '') return;

    const screenRequestContext = context.action.params.params.context;
    const screenRequestParams: IScreenCtaContextParams = {
        ctaId: context.action.params.params.ctaId,
        flowInputData: undefined, // TODO
        screenInputData: undefined // TODO
    };

    const body: IScreenRequest = {
        context: {
            ...screenRequestContext,
            params: screenRequestParams
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
        const apiClient = new ApiClient();
        const screenResponse = await apiClient.http.post('/walletUi/screen/cta', body);
        const data: IScreenCtaResponse = screenResponse?.result?.data;

        handleCta(data.cta, {})(dispatch, getState);
    } catch (error) {
        // handle error
        SentryAddBreadcrumb({
            message: JSON.stringify({
                request: body,
                error
            })
        });

        SentryCaptureException(new Error('Fetch /walletUi/screen/cta'));
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
