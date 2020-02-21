import VoipPushNotification from 'react-native-voip-push-notification';
import { dataMessageHandler } from '../handlers/data-message';

let tokenPromise = null;

export const setupVoipNotification = () => {
    VoipPushNotification.requestPermissions(); // required

    getApnsToken();

    VoipPushNotification.addEventListener('notification', notification => {
        dataMessageHandler(notification.getMessage().data);
    });
};

export const getApnsToken = () => {
    if (tokenPromise) {
        return tokenPromise;
    }

    tokenPromise = new Promise(resolve => {
        VoipPushNotification.addEventListener('register', deviceToken => {
            resolve(deviceToken);
        });
    });
    return tokenPromise;
};
