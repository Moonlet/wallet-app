import * as Sentry from '@sentry/react-native';
// Sentry setup
if (!__DEV__) {
    Sentry.init({
        dsn: 'https://2c951fc8d1834886877276fa9a7e89bb@sentry.io/5173962'
    });
}

import { AppRegistry, Platform } from 'react-native';
import App from './src/app';
import { name as appName } from './app.json';
import firebase from 'firebase/app';
import CONFIG from './src/config';

// TODO remove this when fixed
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['RCTRootView cancelTouches']);

firebase.initializeApp(CONFIG.firebaseConfig);

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, { rootTag: document.getElementById('root') });
