import VoipPushNotification from 'react-native-voip-push-notification';
import { silentMessageHandler } from './silent-push-handler';

let token = '';

export const setupVoipNotification = () => {
    VoipPushNotification.requestPermissions(); // required

    VoipPushNotification.addEventListener('register', deviceToken => {
        token = deviceToken;
    });

    VoipPushNotification.addEventListener('notification', notification => {
        silentMessageHandler({
            payload: notification.getMessage()
        });
    });
};

export const getApnsToken = () => {
    return token;
};
