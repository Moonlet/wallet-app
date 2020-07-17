import { HttpClient } from '../../core/utils/http-client';
import CONFIG from '../../config';
import { Notifications } from '../../core/messaging/notifications/notifications';
import { captureException as SentryCaptureException } from '@sentry/react-native';
import { getSelectedWallet } from '../wallets/selectors';
import { Dispatch } from 'react';
import { IReduxState } from '../state';
import { PushNotifTokenType } from '../../core/messaging/types';
import { IAccountState } from '../wallets/state';
import { getTokenConfig } from '../tokens/static-selectors';
import { getWalletCredentialsKey } from '../../core/secure/keychain/keychain';
import * as schnorr from '@zilliqa-js/crypto/dist/schnorr';
import moment from 'moment';

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

const getTimestamp = () => {
    return moment().unix() * 1000;
};

const getDomain = () => {
    return new URL(CONFIG.walletApiBaseUrl).host;
};

const getSignature = (data: any, walletPrivateKey: string, walletPublicKey: string): string => {
    const sig = schnorr.sign(
        Buffer.from(JSON.stringify(data), 'hex'),
        Buffer.from(walletPrivateKey, 'hex'),
        Buffer.from(walletPublicKey, 'hex')
    );

    return sig.r.toString('hex') + sig.s.toString('hex');
};

export const getUnseenNotifications = () => async (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
): Promise<number> => {
    try {
        const state = getState();
        const walletPublicKey = getSelectedWallet(state)?.walletPublicKey;

        if (walletPublicKey) {
            const walletPrivateKey = await getWalletCredentialsKey(walletPublicKey);

            const data: any = {
                timestamp: getTimestamp(),
                domain: getDomain()
            };

            const signature = getSignature(data, walletPrivateKey, walletPublicKey);
            data.walletPublicKeys = [
                {
                    walletPublicKey,
                    signature
                }
            ];

            const http = new HttpClient(CONFIG.walletApiBaseUrl);
            const res = await http.post('/notifications/unseen', data);

            if (res?.result?.unseenNotifications) {
                setUnseenNotifications(res.result.unseenNotifications);
                return res.result.unseenNotifications;
            } else {
                setUnseenNotifications(0);
                return 0;
            }
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
        const walletPublicKey = getSelectedWallet(state)?.walletPublicKey;

        if (walletPublicKey) {
            const walletPrivateKey = await getWalletCredentialsKey(walletPublicKey);
            if (walletPrivateKey) {
                const data: any = {
                    walletPublicKey,
                    timestamp: getTimestamp(),
                    domain: getDomain()
                };

                const signature = getSignature(data, walletPrivateKey, walletPublicKey);
                data.signature = signature;

                const http = new HttpClient(CONFIG.walletApiBaseUrl);
                const url = page ? `/notifications/${page}` : '/notifications';
                const response = await http.post(url, data);

                if (response?.result?.notifications) {
                    return response.result.notifications;
                }
            }
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
        const walletPublicKey = getSelectedWallet(state)?.walletPublicKey;

        if (walletPublicKey) {
            const walletPrivateKey = await getWalletCredentialsKey(walletPublicKey);
            if (walletPrivateKey) {
                const data: any = {
                    walletPublicKey,
                    timestamp: getTimestamp(),
                    domain: getDomain(),

                    deviceId: state.preferences.deviceId,
                    token: {
                        type: PushNotifTokenType.FCM,
                        token: await Notifications.getToken()
                    }
                };

                const signature = getSignature(data, walletPrivateKey, walletPublicKey);
                data.signature = signature;

                const http = new HttpClient(CONFIG.walletApiBaseUrl);
                const response = await http.post(
                    '/notifications/register-push-notification-token',
                    data
                );

                if (response?.result?.pushNotifToken) {
                    return response.result.pushNotifToken;
                }
            }
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
        const walletPublicKey = getSelectedWallet(state)?.walletPublicKey;
        const myAccounts = [];

        if (walletPublicKey) {
            const walletPrivateKey = await getWalletCredentialsKey(walletPublicKey);
            if (walletPrivateKey) {
                for (const wallet of Object.values(state.wallets)) {
                    wallet.accounts.map(async (account: IAccountState) => {
                        const myTokens = [];

                        for (const chainId of Object.keys(account.tokens)) {
                            for (const symbol of Object.keys(account.tokens[chainId])) {
                                const tokenConfig = getTokenConfig(account.blockchain, symbol);

                                myTokens.push({
                                    symbol,
                                    contractAddress: tokenConfig?.contractAddress
                                });
                            }
                        }

                        myAccounts.push({
                            blockchain: account.blockchain,
                            address: account.address.toLocaleLowerCase(),
                            tokens: myTokens
                        });
                    });
                }

                const data: any = {
                    walletPublicKey,
                    timestamp: getTimestamp(),
                    domain: getDomain(),

                    deviceId: state.preferences.deviceId,
                    accounts: myAccounts
                };

                const signature = getSignature(data, walletPrivateKey, walletPublicKey);
                data.signature = signature;

                const http = new HttpClient(CONFIG.walletApiBaseUrl);
                await http.post('/notifications/register-notification-settings', data);
            }
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
        const state = getState();
        const walletPublicKey = getSelectedWallet(state)?.walletPublicKey;

        if (walletPublicKey) {
            const walletPrivateKey = await getWalletCredentialsKey(walletPublicKey);
            if (walletPrivateKey) {
                const data: any = {
                    walletPublicKey,
                    timestamp: getTimestamp(),
                    domain: getDomain(),

                    notifIds: [notificationId]
                };

                const signature = getSignature(data, walletPrivateKey, walletPublicKey);
                data.signature = signature;

                const http = new HttpClient(CONFIG.walletApiBaseUrl);
                const response = await http.post('/notifications/mark-seen', data);

                if (response?.result?.notifications) {
                    if (blockchain) {
                        dispatch({
                            type: MARK_SEEN,
                            data: { blockchain, notificationId }
                        });
                    }

                    return response.result.notifications;
                }
            }
        }
    } catch (err) {
        SentryCaptureException(new Error(JSON.stringify(err)));
    }
};
