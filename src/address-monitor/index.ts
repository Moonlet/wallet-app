import { Platform } from 'react-native';
import { Notifications } from '../core/messaging/notifications/notifications';
import { getApnsToken } from '../core/messaging/silent/ios-voip-push-notification';
import { Blockchain } from '../core/blockchain/types';

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

export const removeAddress = async (blockchain: Blockchain, address: string[]) => {
    const request = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            blockchain,
            address
        })
    };

    fetch(url + '/remove', request);
};
