import { RemoteMessage } from 'react-native-firebase/messaging';
import { silentMessageHandler } from './silent-push-handler';

// import firebase from 'react-native-firebase';
export default async (message: RemoteMessage) => {
    const payload = message.data;

    silentMessageHandler({
        payload
    });
};
