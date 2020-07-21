import { getSelectedWallet } from '../wallets/selectors';
import { Dispatch } from 'react';
import { IReduxState } from '../state';
import { ApiClient } from '../../core/utils/api-client';
import { FETCH_UNSEEN_NOTIFS_INTERVAL } from '../../core/constants/app';

export const SET_UNSEEN_NOTIFICATIONS = 'SET_UNSEEN_NOTIFICATIONS';
export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';
export const MARK_SEEN = 'MARK_SEEN';

let unseenNotificationsInterval;

export const setNotifications = (notifications: any) => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    dispatch({
        type: SET_NOTIFICATIONS,
        data: { notifications }
    });
};

export const clearUnseenNotificationsInterval = () => {
    clearInterval(unseenNotificationsInterval);
};

export const startNotificationsHandlers = () => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    registerPushNotifToken()(dispatch, getState);
    registerNotificationSettings()(dispatch, getState);
    getUnseenNotifications()(dispatch, getState);

    unseenNotificationsInterval = setInterval(() => {
        getUnseenNotifications()(dispatch, getState);
    }, FETCH_UNSEEN_NOTIFS_INTERVAL);

    const notifications = await fetchNotifications()(dispatch, getState);
    if (notifications) {
        setNotifications(notifications)(dispatch, getState);
    }
};

export const getUnseenNotifications = () => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const state = getState();
    const walletPublicKey = getSelectedWallet(state)?.walletPublicKey;

    if (walletPublicKey) {
        const apiClient = new ApiClient();
        const unseenNotifications = await apiClient.getUnseenNotifications(walletPublicKey);

        dispatch({
            type: SET_UNSEEN_NOTIFICATIONS,
            data: { unseenNotifications }
        });
    }
};

export const fetchNotifications = (page?: number) => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const state = getState();
    const walletPublicKey = getSelectedWallet(state)?.walletPublicKey;

    if (walletPublicKey) {
        const apiClient = new ApiClient();
        return apiClient.fetchNotifications(walletPublicKey, page);
    }
};

export const registerPushNotifToken = () => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const state = getState();
    const walletPublicKey = getSelectedWallet(state)?.walletPublicKey;

    if (walletPublicKey) {
        const apiClient = new ApiClient();
        await apiClient.registerPushNotifToken(walletPublicKey, state.preferences.deviceId);
    }
};

export const registerNotificationSettings = () => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const state = getState();

    const apiClient = new ApiClient();

    for (const wallet of Object.values(state.wallets)) {
        await apiClient.registerNotificationSettings(wallet, state.preferences.deviceId);
    }
};

export const markSeenNotification = (notificationId: string, blockchain?: string) => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const state = getState();
    const walletPublicKey = getSelectedWallet(state)?.walletPublicKey;

    if (walletPublicKey) {
        if (blockchain) {
            dispatch({
                type: MARK_SEEN,
                data: { blockchain, notificationId }
            });
        }

        const apiClient = new ApiClient();
        await apiClient.markSeenNotification(walletPublicKey, notificationId);
    }
};
