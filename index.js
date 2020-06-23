import { init } from '@sentry/react-native';
import { sanitizeObject } from './src/core/utils/object-sanitise';

// tbd - ios swipe back fix - not sure - only on release it crashes
import 'react-native-gesture-handler';
import DeviceInfo from 'react-native-device-info';

// Sentry setup
if (!__DEV__) {
    if (DeviceInfo.getBundleId() === 'com.moonlet.beta') {
        // beta app
        init({
            dsn: Platform.select({
                ios: 'https://ace08885fd314c4fa8b57cd6996e8c56@o308222.ingest.sentry.io/5285151',
                android: 'https://5c7b33ecb802428689eeeb35b20c8a64@o308222.ingest.sentry.io/5285148'
            }),
            environment: DeviceInfo.getBundleId(),
            beforeBreadcrumb(breadcrumb) {
                try {
                    breadcrumb.message = JSON.stringify(breadcrumb.message);
                } catch {}
                breadcrumb = sanitizeObject(breadcrumb);
                breadcrumb.message = JSON.stringify(breadcrumb.message);
                return breadcrumb;
            }
        });
    } else {
        // production app
        init({
            dsn: Platform.select({
                ios: 'https://118a06794f1543259239c453f2fc8f05@o308222.ingest.sentry.io/5282231',
                android: 'https://5a0742a051904564abcf8449f9865ffa@o308222.ingest.sentry.io/5282230'
            }),
            environment: DeviceInfo.getBundleId(),
            beforeBreadcrumb(breadcrumb) {
                try {
                    breadcrumb.message = JSON.stringify(breadcrumb.message);
                } catch {}
                breadcrumb = sanitizeObject(breadcrumb);
                breadcrumb.message = JSON.stringify(breadcrumb.message);
                return breadcrumb;
            }
        });
    }
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
