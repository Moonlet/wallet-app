import { init } from '@sentry/browser';
import { sanitizeSentryBreadcrumb } from './src/core/utils/object-sanitise';
import DeviceInfo from 'react-native-device-info';

// Sentry setup
if (!__DEV__) {
    if (DeviceInfo.getBundleId() === 'com.moonlet.beta') {
        // beta extension
        init({
            dsn: 'https://4c0fec8b0d754dad842c82467e675d38@o308222.ingest.sentry.io/5285152',
            environment: DeviceInfo.getBundleId(),
            beforeBreadcrumb: sanitizeSentryBreadcrumb
        });
    } else {
        // release extension
        init({
            dsn: 'https://2c951fc8d1834886877276fa9a7e89bb@o308222.ingest.sentry.io/5173962',
            environment: DeviceInfo.getBundleId(),
            beforeBreadcrumb: sanitizeSentryBreadcrumb
        });
    }
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
