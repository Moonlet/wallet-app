import { Platform } from 'react-native';
import { Notifications } from '../messaging/notifications/notifications';
import { getApnsToken } from '../messaging/silent/ios-voip-push-notification';
import { Blockchain } from '../blockchain/types';

const url = 'https://us-central1-moonlet-wallet-dev.cloudfunctions.net/addressMonitor';

const getDeviceToken = () =>
    Platform.OS === 'android' ? Notifications.getToken() : getApnsToken();

export const addAddress = async (blockchain: Blockchain, address: string[]) => {
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            blockchain,
            token: await getDeviceToken(),
            type: Platform.OS === 'android' ? 'fcm' : 'apn',
            address
        })
    };

    fetch(url + '/add', request);
};
