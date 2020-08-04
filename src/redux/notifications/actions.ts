import { getSelectedWallet } from '../wallets/selectors';
import { Dispatch } from 'react';
import { IReduxState } from '../state';
import { ApiClient } from '../../core/utils/api-client/api-client';
import { getChainId } from '../preferences/selectors';
import { Blockchain } from '../../core/blockchain/types';

export const SET_UNSEEN_NOTIFICATIONS = 'SET_UNSEEN_NOTIFICATIONS';
export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';
export const MARK_SEEN = 'MARK_SEEN';

export const setNotifications = (notifications: any) => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    dispatch({
        type: SET_NOTIFICATIONS,
        data: { notifications }
    });
};

export const startNotificationsHandlers = () => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    registerPushNotifToken()(dispatch, getState);
    registerNotificationSettings()(dispatch, getState);
    getUnseenNotifications()(dispatch, getState);
};

export const getUnseenNotifications = () => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const state = getState();

    const walletPublicKeys: string[] = Object.values(state.wallets).map(w => w?.walletPublicKey);

    const unseenNotifications = await new ApiClient().notifications.getUnseenNotifications(
        walletPublicKeys
    );

    dispatch({
        type: SET_UNSEEN_NOTIFICATIONS,
        data: { unseenNotifications }
    });
};

export const fetchNotifications = (page?: number) => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const state = getState();

    const blockchainNetworks = [];

    for (const blockchain of Object.values(Blockchain)) {
        const chainId = getChainId(state, blockchain);
        if (chainId && chainId !== '') {
            blockchainNetworks.push({ chainId: String(chainId), blockchain });
        }
    }

    const walletPublicKeys: string[] = Object.values(state.wallets).map(w => w?.walletPublicKey);

    return new ApiClient().notifications.fetchNotifications(
        walletPublicKeys,
        blockchainNetworks,
        page
    );
};

export const registerPushNotifToken = () => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const state = getState();
    const walletPublicKey = getSelectedWallet(state)?.walletPublicKey;

    if (walletPublicKey) {
        await new ApiClient().notifications.registerPushNotifToken(
            walletPublicKey,
            state.preferences.deviceId
        );
    }
};

export const registerNotificationSettings = () => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const state = getState();

    const apiClient = new ApiClient();

    for (const wallet of Object.values(state.wallets)) {
        await apiClient.notifications.registerNotificationSettings(
            wallet,
            state.preferences.deviceId
        );
    }
};

export const markSeenNotification = (notificationId: string) => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const state = getState();
    const walletPublicKey = getSelectedWallet(state)?.walletPublicKey;

    if (walletPublicKey) {
        dispatch({
            type: MARK_SEEN,
            data: { notificationId }
        });

        await new ApiClient().notifications.markSeenNotification(walletPublicKey, notificationId);
        getUnseenNotifications()(dispatch, getState);
    }
};
