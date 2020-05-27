import { init } from '@sentry/browser';
import DeviceInfo from 'react-native-device-info';

// Sentry setup
if (!__DEV__) {
    init({
        dsn: 'https://2c951fc8d1834886877276fa9a7e89bb@sentry.io/5173962',
        environment: DeviceInfo.getBundleId()
    });
}

import { AppRegistry } from 'react-native';
import App from './src/app';
import { name as appName } from './app.json';
import firebase from 'firebase/app';
import CONFIG from './src/config';

// TODO remove this when fixed
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['RCTRootView cancelTouches']);

firebase.initializeApp(CONFIG.firebaseWebConfig);

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, { rootTag: document.getElementById('root') });
