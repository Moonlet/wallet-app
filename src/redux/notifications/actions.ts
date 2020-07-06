import { HttpClient } from '../../core/utils/http-client';
import CONFIG from '../../config';
import { Notifications } from '../../core/messaging/notifications/notifications';
import { captureException as SentryCaptureException } from '@sentry/react-native';
import { getSelectedWallet } from '../wallets/selectors';
import { Dispatch } from 'react';
import { IReduxState } from '../state';

export const SET_HAS_UNSEEN_NOTIFICATIONS = 'SET_HAS_UNSEEN_NOTIFICATIONS';
export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';
export const MARK_SEEN = 'MARK_SEEN';

const setHasUnseenNotifications = (hasUnseenNotifications: boolean) => {
    return {
        type: SET_HAS_UNSEEN_NOTIFICATIONS,
        data: { hasUnseenNotifications }
    };
};

export const setNotifications = (notifications: any) => {
    return {
        type: SET_NOTIFICATIONS,
        data: { notifications }
    };
};

export const getHasUnseenNotifications = () => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    try {
        const state = getState();
        const walletId = getSelectedWallet(state)?.id;

        const http = new HttpClient(CONFIG.walletApiBaseUrl + '/notifications/unseen');
        const res = await http.post('', {
            walletPublicKey: walletId
        });

        if (res?.result?.hasUnseenNotifications) {
            setHasUnseenNotifications(res.result.hasUnseenNotifications);
            return Promise.resolve(res.result.hasUnseenNotifications);
        } else {
            setHasUnseenNotifications(false);
            return Promise.resolve(false);
        }
    } catch (err) {
        SentryCaptureException(new Error(JSON.stringify(err)));
        setHasUnseenNotifications(false);
        return Promise.resolve(false);
    }
};

// TODO: When fetching multiple pages of notifications,
//       maybe we should find a way to cache those notifications
//       in order to minimise the calls to our api
export const fetchNotifications = (page: number = 1) => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    try {
        const state = getState();
        const walletId = getSelectedWallet(state)?.id;

        const http = new HttpClient(CONFIG.walletApiBaseUrl + `/notifications/${page}`);
        const response = await http.post('', {
            walletPublicKey: walletId
        });

        if (response?.result?.notifications) {
            return response.result.notifications;
        }
    } catch (err) {
        SentryCaptureException(new Error(JSON.stringify(err)));
    }
};

// TODO: this is section is work in progress
export const registerPushNotifToken = () => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    try {
        const state = getState();
        const walletId = getSelectedWallet(state)?.id;

        const http = new HttpClient(CONFIG.walletApiBaseUrl + '/notifications/register');
        const response = await http.post('', {
            walletPublicKey: walletId, // TODO: this needs to be updated
            token: {
                deviceId: state.preferences.deviceId,
                type: 'fcm', // PushNotifTokenType.FCM,
                token: await Notifications.getToken()
            },
            // This is work in progress
            accounts: [
                {
                    walletId,
                    address: 'address',
                    tokens: [
                        { contract: 'native_token_address' },
                        { contract: 'zrc2_token_address' }
                    ]
                }
            ]
        });

        if (response?.result?.pushNotifToken) {
            return response.result.pushNotifToken;
        }
    } catch (err) {
        SentryCaptureException(new Error(JSON.stringify(err)));
    }
};

export const markSeenNotification = (notificationId: string, blockchain?: string) => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    try {
        const http = new HttpClient(CONFIG.walletApiBaseUrl + '/notifications/markseen');
        const response = await http.post('', {
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
