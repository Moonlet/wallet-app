import {
    registerPushNotifToken,
    registerNotificationSettings,
    markSeenNotification,
    fetchNotifications,
    getUnseenNotifications
} from './notifications';
import { IWalletsState } from '../../../redux/wallets/state';

export class ApiClient {
    public async registerPushNotifToken(walletPublicKey: string, deviceId: string): Promise<void> {
        return registerPushNotifToken(walletPublicKey, deviceId);
    }

    public async registerNotificationSettings(
        walletPublicKey: string,
        wallets: IWalletsState,
        deviceId: string
    ): Promise<void> {
        return registerNotificationSettings(walletPublicKey, wallets, deviceId);
    }

    public async markSeenNotification(
        walletPublicKey: string,
        notificationId: string
    ): Promise<any> {
        return markSeenNotification(walletPublicKey, notificationId);
    }

    public async fetchNotifications(walletPublicKey: string, page?: number): Promise<any> {
        return fetchNotifications(walletPublicKey, page);
    }

    public async getUnseenNotifications(walletPublicKey: string): Promise<number> {
        return getUnseenNotifications(walletPublicKey);
    }
}
