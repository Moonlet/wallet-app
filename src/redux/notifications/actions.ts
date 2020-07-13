import { HttpClient } from '../../core/utils/http-client';
import CONFIG from '../../config';
import { Notifications } from '../../core/messaging/notifications/notifications';
import { captureException as SentryCaptureException } from '@sentry/react-native';
import { getSelectedWallet } from '../wallets/selectors';
import { Dispatch } from 'react';
import { IReduxState } from '../state';
import { PushNotifTokenType } from '../../core/messaging/types';
import { IWalletState, IAccountState } from '../wallets/state';
import { ChainIdType } from '../../core/blockchain/types';
import { getTokenConfig } from '../tokens/static-selectors';

export const SET_UNSEEN_NOTIFICATIONS = 'SET_UNSEEN_NOTIFICATIONS';
export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';
export const MARK_SEEN = 'MARK_SEEN';

const setUnseenNotifications = (unseenNotifications: number) => {
    return {
        type: SET_UNSEEN_NOTIFICATIONS,
        data: { unseenNotifications }
    };
};

export const setNotifications = (notifications: any) => {
    return {
        type: SET_NOTIFICATIONS,
        data: { notifications }
    };
};

export const getUnseenNotifications = () => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
): Promise<number> => {
    try {
        const state = getState();
        const walletId = getSelectedWallet(state)?.id;

        const http = new HttpClient(CONFIG.walletApiBaseUrl);
        const res = await http.post('/notifications/unseen', {
            walletPublicKeys: [walletId]
        });

        if (res?.result?.unseenNotifications) {
            setUnseenNotifications(res.result.unseenNotifications);
            return res.result.unseenNotifications;
        } else {
            setUnseenNotifications(0);
            return 0;
        }
    } catch (err) {
        SentryCaptureException(new Error(JSON.stringify(err)));
        setUnseenNotifications(0);
    }
};

// TODO: When fetching multiple pages of notifications,
//       maybe we should find a way to cache those notifications
//       in order to minimise the calls to our api
export const fetchNotifications = (page?: number) => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    try {
        const state = getState();
        const walletId = getSelectedWallet(state)?.id;

        const http = new HttpClient(CONFIG.walletApiBaseUrl);
        const url = page ? `/notifications/${page}` : '/notifications';

        const response = await http.post(url, {
            walletPublicKey: walletId
        });

        if (response?.result?.notifications) {
            return response.result.notifications;
        }
    } catch (err) {
        SentryCaptureException(new Error(JSON.stringify(err)));
    }
};

export const registerPushNotifToken = () => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    try {
        const state = getState();

        const http = new HttpClient(CONFIG.walletApiBaseUrl);
        const response = await http.post('/notifications/register-push-notification-token', {
            deviceId: state.preferences.deviceId,
            token: {
                type: PushNotifTokenType.FCM,
                token: await Notifications.getToken()
            }
        });

        if (response?.result?.pushNotifToken) {
            return response.result.pushNotifToken;
        }
    } catch (err) {
        SentryCaptureException(new Error(JSON.stringify(err)));
    }
};

export const registerNotificationSettings = () => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    try {
        const state = getState();
        const walletId = getSelectedWallet(state)?.id;

        const myAccounts = [];

        await Promise.all(
            Object.values(state.wallets).map((wallet: IWalletState) => {
                wallet.accounts.map(async (account: IAccountState) => {
                    const myTokens = [];

                    await Promise.all(
                        Object.keys(account.tokens).map((chainId: ChainIdType) => {
                            // Chain Id layer
                            Object.keys(account.tokens[chainId]).map((symbol: string) => {
                                // Symbol layer
                                const tokenConfig = getTokenConfig(account.blockchain, symbol);

                                myTokens.push({
                                    symbol,
                                    contractAddress: tokenConfig?.contractAddress
                                });
                            });
                        })
                    );

                    myAccounts.push({
                        blockchain: account.blockchain,
                        address: account.address,
                        tokens: myTokens
                    });
                });
            })
        );

        const http = new HttpClient(CONFIG.walletApiBaseUrl);
        await http.post('/notifications/register-notification-settings', {
            walletPublicKey: walletId,
            deviceId: state.preferences.deviceId,
            accounts: myAccounts
        });
    } catch (err) {
        SentryCaptureException(new Error(JSON.stringify(err)));
    }
};

export const markSeenNotification = (notificationId: string, blockchain?: string) => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    try {
        const http = new HttpClient(CONFIG.walletApiBaseUrl);
        const response = await http.post('/notifications/mark-seen', {
            notifIds: [notificationId]
        });

        if (response?.result?.notifications) {
            if (blockchain) {
                dispatch({
                    type: MARK_SEEN,
                    data: { blockchain, notificationId }
                });
            }

            return response.result.notifications;
        }
    } catch (err) {
        SentryCaptureException(new Error(JSON.stringify(err)));
    }
};
