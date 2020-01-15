import * as Sentry from '@sentry/react-native';

// tbd - ios swipe back fix - not sure - only on release it crashes
import 'react-native-gesture-handler';

// Sentry setup
if (!__DEV__) {
    Sentry.init({
        dsn: 'https://a25bae06b15b4a09a5ecc4681f50d79f@sentry.io/1770011'
    });
}

import 'node-libs-react-native/globals';

import { AppRegistry, Platform } from 'react-native';
import App from './src/app';
import { name as appName } from './app.json';
import androidBgMessagingHandler from './src/core/messaging/silent/android-background-messaging';

// TODO remove this when fixed
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['RCTRootView cancelTouches', 'Require cycle']);

// console.disableYellowBox = true;

if (Platform.OS === 'android') {
    AppRegistry.registerHeadlessTask(
        'RNFirebaseBackgroundMessage',
        () => androidBgMessagingHandler
    );
}
AppRegistry.registerComponent(appName, () => App);
