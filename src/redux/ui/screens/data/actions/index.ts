import { Dispatch } from 'react';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import {
    ICtaAction,
    IScreenContext,
    IScreenCtaContextParams,
    IScreenCtaResponse,
    IScreenRequest,
    IScreenValidation
} from '../../../../../components/widgets/types';
import { ApiClient } from '../../../../../core/utils/api-client/api-client';
import { getChainId } from '../../../../preferences/selectors';
import { IReduxState } from '../../../../state';
import { IAction } from '../../../../types';
import { flattenObject } from '../../../../utils/helpers';
import { getSelectedWallet, getSelectedAccount } from '../../../../wallets/selectors';
import { runScreenValidation, setScreenInputData } from '../../input-data/actions';
import { handleCta, IHandleCtaOptions } from '../handle-cta';
import * as transactions from './transactions';
import {
    addBreadcrumb as SentryAddBreadcrumb,
    captureException as SentryCaptureException
} from '@sentry/react-native';
import { getScreenDataKey } from '../reducer';

export interface IHandleCtaActionContext<P = any> {
    action: ICtaAction<P>;
    options?: IHandleCtaOptions;
}

export const handleDynamicCta = (
    context: IHandleCtaActionContext<{
        ctaId: string;
        context: IScreenContext;
        steps: string[];
        extraParams?: any;
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
    const steps = context.action.params.params?.steps || [];
    const extraParams = context.action.params?.params?.extraParams;

    const screenInputData = {};

    for (const step of steps) {
        const screenKey = getScreenDataKey({
            pubKey: getSelectedWallet(state)?.walletPublicKey,
            blockchain: account?.blockchain,
            chainId: String(chainId),
            address: account.address,
            step,
            tab: undefined
        });

        const inputData = state.ui.screens.inputData[screenKey]?.data || {};

        screenInputData[screenKey] = {
            ...inputData,
            increasedBlocks: 15
        };
    }

    const flowId = screenRequestContext?.flowId || context?.options?.flowId;

    const screenRequestParams: IScreenCtaContextParams = {
        ctaId: context.action.params.params.ctaId,
        flowInputData: state.ui.screens.inputData[flowId]?.data || {},
        screenInputData,
        extraParams
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

        if (data?.cta) {
            handleCta(data.cta, { flowId })(dispatch, getState);
        } else {
            SentryAddBreadcrumb({ message: JSON.stringify({ request: body }) });
            SentryAddBreadcrumb({ message: JSON.stringify({ screenResponse }) });
            SentryAddBreadcrumb({ message: JSON.stringify({ code: screenResponse?.code }) });

            throw new Error(`No data cta, ${screenResponse?.message}`);
        }
    } catch (error) {
        // handle error
        SentryAddBreadcrumb({ message: JSON.stringify({ request: body }) });
        SentryAddBreadcrumb({ message: JSON.stringify({ error }) });
        SentryAddBreadcrumb({ message: JSON.stringify({ code: error?.code }) });

        SentryCaptureException(new Error(`Cannot fetch cta, ${error?.message}`));
    }
};

export const setReduxScreenInputData = (
    context: IHandleCtaActionContext<transactions.IContractCallParams>
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    if (context.action.params?.params && context?.options?.screenKey) {
        const step = (context.action.params?.params as any)?.step;

        let screenKey = context.options.screenKey;

        if (step) {
            const state = getState();

            const account = getSelectedAccount(state);
            const chainId = getChainId(state, account.blockchain);

            screenKey = getScreenDataKey({
                pubKey: getSelectedWallet(state)?.walletPublicKey,
                blockchain: account?.blockchain,
                chainId: String(chainId),
                address: account?.address,
                step,
                tab: undefined
            });
        }

        setScreenInputData(screenKey, context.action.params?.params)(dispatch, getState);
    }
};

export const runScreenValidations = (
    context: IHandleCtaActionContext<{ screenValidation: IScreenValidation }>
) => async (dispatch: Dispatch<IAction<any>>, getState: () => IReduxState) => {
    if (context.action.params?.params?.screenValidation && context?.options?.screenKey) {
        runScreenValidation(
            context.action.params?.params?.screenValidation,
            context.options.screenKey
        )(dispatch, getState);
    }
};

export const supportedActions = flattenObject({
    transactions,
    setReduxScreenInputData,
    runScreenValidations,
    handleDynamicCta
});
