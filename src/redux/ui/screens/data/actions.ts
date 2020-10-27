import { Dispatch } from 'react';
import { IReduxState } from '../../../state';
import {
    IScreenContext,
    IScreenRequest,
    IScreenResponse
} from '../../../../components/widgets/types';
import { ApiClient } from '../../../../core/utils/api-client/api-client';
import { Blockchain } from '../../../../core/blockchain/types';
import { AccountType } from '../../../wallets/state';
import { IAction } from '../../../types';
import { getSelectedAccount, getSelectedWallet } from '../../../wallets/selectors';
import { Platform } from 'react-native';
import { getChainId } from '../../../preferences/selectors';

export const FETCH_SCREEN_DATA = 'FETCH_SCREEN_DATA';

export const fetchScreenData = (context: IScreenContext) => async (
    dispatch: Dispatch<
        IAction<{
            request: IScreenRequest;
            response: IScreenResponse;
            isLoading: boolean;
            error: any;
        }>
    >,
    getState: () => IReduxState
) => {
    const state = getState();
    const wallet = getSelectedWallet(state);
    const account = getSelectedAccount(state);
    const chainId = getChainId(state, account.blockchain);

    const apiClient = new ApiClient();

    const body: IScreenRequest = {
        context: {
            screen: context.screen,
            tab: context?.tab
        },
        user: {
            os: Platform.OS as 'ios' | 'android',
            deviceId: state.preferences.deviceId,
            theme: 'dark',
            country: 'Moon',
            lang: 'en',

            wallet: {
                pubKey: wallet.walletPublicKey,
                type: wallet.type
            },

            blockchain: Blockchain.ZILLIQA,
            chainId: String(chainId),
            address: account.address,
            accountType: AccountType.DEFAULT
        }
    };

    const screenResponse = await apiClient.http.post('/walletUi/screen', body);
    const data: IScreenResponse = screenResponse?.result?.data;

    if (data) {
        dispatch({
            type: FETCH_SCREEN_DATA,
            data: {
                request: body,
                response: data,
                isLoading: true,
                error: undefined
            }
        });
    } else {
        // handle error
    }
};

// loading => true
// response => true
// afisez datele vechi

// loading => true
// response => false
// skeleton

// loading =>
// error
// widget de show error => buton de retry
