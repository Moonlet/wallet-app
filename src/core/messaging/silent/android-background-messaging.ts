import { RemoteMessage } from 'react-native-firebase/messaging';
import { dataMessageHandler } from '../handlers/data-message';

// import firebase from 'react-native-firebase';
export default async (message: RemoteMessage) => {
    dataMessageHandler(message.data as any);
};
