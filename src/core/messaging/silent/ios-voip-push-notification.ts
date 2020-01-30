import VoipPushNotification from 'react-native-voip-push-notification';
import { silentMessageHandler } from './silent-push-handler';

let tokenPromise = null;

export const setupVoipNotification = () => {
    VoipPushNotification.requestPermissions(); // required

    getApnsToken();

    VoipPushNotification.addEventListener('notification', notification => {
        silentMessageHandler({
            payload: notification.getMessage()
        });
    });
};

export const getApnsToken = () => {
    if (tokenPromise) { return tokenPromise; }

    tokenPromise = new Promise(resolve => {
        VoipPushNotification.addEventListener('register', deviceToken => {
            resolve(deviceToken);
        });
    });
    return tokenPromise;
};
