import { captureException as SentryCaptureException } from '@sentry/react-native';
import { getWalletCredentialsKey } from '../../secure/keychain/keychain';
import {
    getCurrentTimestampNTP,
    getWalletApiDomain,
    getSignature,
    removeDuplicateObjectsFromArray
} from './utils';
import { PushNotifTokenType } from '../../messaging/types';
import { Notifications } from '../../messaging/notifications/notifications';
import { IAccountState, IWalletState } from '../../../redux/wallets/state';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';
import { ApiClient } from './api-client';

export class NotificationsApiClient {
    constructor(private apiClient: ApiClient) {}

    /**
     * Fetch notifications
     * @param page
     *
     * TODO: When fetching multiple pages of notifications, maybe we should find a way to cache those notifications
     *       in order to minimise the calls to our api
     */
    public async fetchNotifications(walletPublicKeys: string[], page?: number) {
        try {
            const data: any = {
                timestamp: await getCurrentTimestampNTP(),
                domain: getWalletApiDomain(),
                page: page || 1
            };

            const dataWalletPublicKeys = [];

            for (const walletPublicKey of walletPublicKeys) {
                const walletPrivateKey = await getWalletCredentialsKey(walletPublicKey);

                const signature = getSignature(data, walletPrivateKey, walletPublicKey);

                dataWalletPublicKeys.push({
                    walletPublicKey,
                    signature
                });
            }

            data.walletPublicKeys = dataWalletPublicKeys;

            const response = await this.apiClient.http.post('/notifications', data);

            if (response?.result?.notifications) {
                return response.result.notifications;
            }
        } catch (err) {
            SentryCaptureException(new Error(JSON.stringify(err)));
        }
    }

    /**
     * Register Push Notification Token
     * @param walletPublicKey
     * @param deviceId
     */
    public async registerPushNotifToken(walletPublicKey: string, deviceId: string) {
        try {
            const walletPrivateKey = await getWalletCredentialsKey(walletPublicKey);
            if (walletPrivateKey) {
                const data: any = {
                    walletPublicKey,
                    timestamp: await getCurrentTimestampNTP(),
                    domain: getWalletApiDomain(),

                    deviceId,
                    token: {
                        type: PushNotifTokenType.FCM,
                        token: await Notifications.getToken()
                    }
                };

                const signature = getSignature(data, walletPrivateKey, walletPublicKey);
                data.signature = signature;

                const response = await this.apiClient.http.post(
                    '/notifications/registerToken',
                    data
                );

                if (response?.result?.pushNotifToken) {
                    return response.result.pushNotifToken;
                }
            }
        } catch (err) {
            SentryCaptureException(new Error(JSON.stringify(err)));
        }
    }

    /**
     * Register Notification Settings
     * @param walletPublicKey
     * @param wallet
     * @param deviceId
     */
    public async registerNotificationSettings(wallet: IWalletState, deviceId: string) {
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
                    timestamp: await getCurrentTimestampNTP(),
                    domain: getWalletApiDomain(),

                    deviceId,
                    accounts: myAccounts
                };

                const signature = getSignature(data, walletPrivateKey, walletPublicKey);
                data.signature = signature;

                await this.apiClient.http.post('/notifications/registerSettings', data);
            }
        } catch (err) {
            SentryCaptureException(new Error(JSON.stringify(err)));
        }
    }

    /**
     * Mark seen notification
     * @param walletPublicKey
     * @param notificationId
     */
    public async markSeenNotification(walletPublicKey: string, notificationId: string) {
        try {
            const walletPrivateKey = await getWalletCredentialsKey(walletPublicKey);
            if (walletPrivateKey) {
                const data: any = {
                    walletPublicKey,
                    timestamp: await getCurrentTimestampNTP(),
                    domain: getWalletApiDomain(),

                    notifIds: [notificationId]
                };

                const signature = getSignature(data, walletPrivateKey, walletPublicKey);
                data.signature = signature;

                await this.apiClient.http.post('/notifications/markSeen', data);
            }
        } catch (err) {
            SentryCaptureException(new Error(JSON.stringify(err)));
        }
    }

    /**
     * Get Unseen Notifications
     * @param walletPublicKeys
     */
    public async getUnseenNotifications(walletPublicKeys: string[]): Promise<number> {
        try {
            const data: any = {
                timestamp: await getCurrentTimestampNTP(),
                domain: getWalletApiDomain()
            };

            const dataWalletPublicKeys = [];

            for (const walletPublicKey of walletPublicKeys) {
                const walletPrivateKey = await getWalletCredentialsKey(walletPublicKey);

                const signature = getSignature(data, walletPrivateKey, walletPublicKey);

                dataWalletPublicKeys.push({
                    walletPublicKey,
                    signature
                });
            }

            data.walletPublicKeys = dataWalletPublicKeys;

            const response = await this.apiClient.http.post('/notifications/unseen', data);

            if (response?.result?.unseenNotifications) {
                return response.result.unseenNotifications;
            }
        } catch (err) {
            SentryCaptureException(new Error(JSON.stringify(err)));
        }

        return 0;
    }
}
