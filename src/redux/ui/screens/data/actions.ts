import { Dispatch } from 'react';
import DeviceInfo from 'react-native-device-info';
import { IReduxState } from '../../../state';
import {
    IScreenContext,
    IScreenRequest,
    IScreenResponse
} from '../../../../components/widgets/types';
import { ApiClient } from '../../../../core/utils/api-client/api-client';
import { IAction } from '../../../types';
import { getSelectedAccount, getSelectedWallet } from '../../../wallets/selectors';
import { Platform } from 'react-native';
import { getChainId } from '../../../preferences/selectors';
import {
    addBreadcrumb as SentryAddBreadcrumb,
    captureException as SentryCaptureException
} from '@sentry/react-native';

export const FETCH_SCREEN_DATA = 'FETCH_SCREEN_DATA';
export const SCREEN_DATA_START_LOADING = 'SCREEN_DATA_START_LOADING';
export const LOAD_MORE_VALIDATORS = 'LOAD_MORE_VALIDATORS';
export const LOAD_MORE_VALIDATORS_V2 = 'LOAD_MORE_VALIDATORS_V2';
export const RESET_SCREEN_DATA = 'RESET_SCREEN_DATA';

export const fetchScreenData = (context: IScreenContext) => async (
    dispatch: Dispatch<
        IAction<
            | { request: IScreenRequest }
            | {
                  request: IScreenRequest;
                  response: IScreenResponse;
                  isLoading: boolean;
                  error: any;
              }
        >
    >,
    getState: () => IReduxState
) => {
    const state = getState();
    const wallet = getSelectedWallet(state);
    if (!wallet) return;
    const account = getSelectedAccount(state);
    if (!account) return;
    const chainId = getChainId(state, account.blockchain);
    if (!chainId || chainId === '') return;

    const apiClient = new ApiClient();

    const body: IScreenRequest = {
        context: {
            screen: context.screen,
            step: context?.step,
            tab: context?.tab,
            flowId: context?.flowId,
            params: context?.params
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

    let flowData;
    if (
        context?.flowId &&
        state.ui.screens.inputData &&
        state.ui.screens.inputData[context.flowId]
    ) {
        flowData = state.ui.screens.inputData[context.flowId].data;
    }

    if (flowData) {
        body.context.flowData = flowData;
    }

    // start loading
    dispatch({ type: SCREEN_DATA_START_LOADING, data: { request: body } });

    try {
        // fetch screen data
        const screenResponse = await apiClient.http.post('/walletUi/screen/widgets', body);
        const data: IScreenResponse = screenResponse?.result?.data;

        dispatch({
            type: FETCH_SCREEN_DATA,
            data: {
                request: body,
                response: data,
                isLoading: false,
                error: !data && screenResponse?.message
            }
        });

        if (!screenResponse?.result?.data) {
            SentryAddBreadcrumb({
                message: JSON.stringify({
                    request: body,
                    screenResponse
                })
            });

            SentryCaptureException(new Error('Fetch /walletUi/screen/widgets'));
        }
    } catch (error) {
        // handle error
        dispatch({
            type: FETCH_SCREEN_DATA,
            data: {
                request: body,
                response: undefined,
                isLoading: false,
                error: error || 'ERROR FETCH_SCREEN_DATA'
            }
        });

        SentryAddBreadcrumb({
            message: JSON.stringify({
                request: body,
                error
            })
        });

        SentryCaptureException(new Error('Fetch /walletUi/screen/widgets'));
    }
};

export const resetScreenData = (context: IScreenContext, screenKey: string) => async (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    dispatch({
        type: RESET_SCREEN_DATA,
        data: { context, screenKey }
    });
};
