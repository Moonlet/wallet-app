import { init } from '@sentry/browser';
import DeviceInfo from 'react-native-device-info';

// Sentry setup
if (!__DEV__) {
    init({
        dsn: 'https://fec608091c734de5a9731c5f2fa860cb@o308222.ingest.sentry.io/5255215',
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
