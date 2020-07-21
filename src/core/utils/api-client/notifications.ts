import { captureException as SentryCaptureException } from '@sentry/react-native';
import { getWalletCredentialsKey } from '../../secure/keychain/keychain';
import {
    getCurrentTimestamp,
    getWalletApiDomain,
    getSignature,
    removeDuplicateObjectsFromArray
} from './utils';
import { HttpClient } from '../http-client';
import CONFIG from '../../../config';
import { PushNotifTokenType } from '../../messaging/types';
import { Notifications } from '../../messaging/notifications/notifications';
import { IAccountState, IWalletState } from '../../../redux/wallets/state';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';

/**
 * Fetch notifications
 * @param page
 *
 * TODO: When fetching multiple pages of notifications, maybe we should find a way to cache those notifications
 *       in order to minimise the calls to our api
 */
export const fetchNotifications = async (walletPublicKey: string, page?: number) => {
    try {
        const walletPrivateKey = await getWalletCredentialsKey(walletPublicKey);
        if (walletPrivateKey) {
            const data: any = {
                walletPublicKey,
                timestamp: getCurrentTimestamp(),
                domain: getWalletApiDomain()
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
    } catch (err) {
        SentryCaptureException(new Error(JSON.stringify(err)));
    }
};

/**
 * Register Push Notification Token
 * @param walletPublicKey
 * @param deviceId
 */
export const registerPushNotifToken = async (walletPublicKey: string, deviceId: string) => {
    try {
        const walletPrivateKey = await getWalletCredentialsKey(walletPublicKey);
        if (walletPrivateKey) {
            const data: any = {
                walletPublicKey,
                timestamp: getCurrentTimestamp(),
                domain: getWalletApiDomain(),

                deviceId,
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
    } catch (err) {
        SentryCaptureException(new Error(JSON.stringify(err)));
    }
};

/**
 * Register Notification Settings
 * @param walletPublicKey
 * @param wallet
 * @param deviceId
 */
export const registerNotificationSettings = async (wallet: IWalletState, deviceId: string) => {
    try {
        const walletPublicKey = wallet.walletPublicKey;
        const walletPrivateKey = await getWalletCredentialsKey(walletPublicKey);

        if (walletPrivateKey) {
            const myAccounts = [];

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
                    tokens: removeDuplicateObjectsFromArray(myTokens)
                });
            });

            const data: any = {
                walletPublicKey,
                timestamp: getCurrentTimestamp(),
                domain: getWalletApiDomain(),

                deviceId,
                accounts: myAccounts
            };

            const signature = getSignature(data, walletPrivateKey, walletPublicKey);
            data.signature = signature;

            const http = new HttpClient(CONFIG.walletApiBaseUrl);
            await http.post('/notifications/register-notification-settings', data);
        }
    } catch (err) {
        SentryCaptureException(new Error(JSON.stringify(err)));
    }
};

/**
 * Mark seen notification
 * @param walletPublicKey
 * @param notificationId
 */
export const markSeenNotification = async (walletPublicKey: string, notificationId: string) => {
    try {
        const walletPrivateKey = await getWalletCredentialsKey(walletPublicKey);
        if (walletPrivateKey) {
            const data: any = {
                walletPublicKey,
                timestamp: getCurrentTimestamp(),
                domain: getWalletApiDomain(),

                notifIds: [notificationId]
            };

            const signature = getSignature(data, walletPrivateKey, walletPublicKey);
            data.signature = signature;

            const http = new HttpClient(CONFIG.walletApiBaseUrl);
            const response = await http.post('/notifications/mark-seen', data);

            if (response?.result?.notifications) {
                return response.result.notifications;
            }
        }
    } catch (err) {
        SentryCaptureException(new Error(JSON.stringify(err)));
    }
};

/**
 * Get Unseen Notifications
 * @param walletPublicKey
 */
export const getUnseenNotifications = async (walletPublicKey: string): Promise<number> => {
    try {
        const walletPrivateKey = await getWalletCredentialsKey(walletPublicKey);

        const data: any = {
            timestamp: getCurrentTimestamp(),
            domain: getWalletApiDomain()
        };

        const signature = getSignature(data, walletPrivateKey, walletPublicKey);
        data.walletPublicKeys = [
            {
                walletPublicKey,
                signature
            }
        ];

        const http = new HttpClient(CONFIG.walletApiBaseUrl);
        const response = await http.post('/notifications/unseen', data);

        if (response?.result?.unseenNotifications) {
            return response.result.unseenNotifications;
        }
    } catch (err) {
        SentryCaptureException(new Error(JSON.stringify(err)));
    }

    return 0;
};
