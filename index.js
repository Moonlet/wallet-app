import { init } from '@sentry/react-native';

// tbd - ios swipe back fix - not sure - only on release it crashes
import 'react-native-gesture-handler';
import DeviceInfo from 'react-native-device-info';

// Sentry setup
if (!__DEV__) {
    init({
        dsn: Platform.select({
            ios: 'https://5a8226a9b01743d3bc32e2d21209e688@sentry.io/5173960',
            android: 'https://afc2777059b34c159e948d6c5122c6fa@sentry.io/5173922'
        }),
        environment: DeviceInfo.getBundleId()
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
console.disableYellowBox = true;

// console.disableYellowBox = true;

if (Platform.OS === 'android') {
    AppRegistry.registerHeadlessTask(
        'RNFirebaseBackgroundMessage',
        () => androidBgMessagingHandler
    );
}
AppRegistry.registerComponent(appName, () => App);
