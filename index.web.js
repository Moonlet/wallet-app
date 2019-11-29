import * as Sentry from '@sentry/react-native';
// Sentry setup
if (!__DEV__) {
    Sentry.init({
        dsn: 'https://a25bae06b15b4a09a5ecc4681f50d79f@sentry.io/1770011'
    });
}

import { AppRegistry, Platform } from 'react-native';
import App from './src/app';
import { name as appName } from './app.json';

// TODO remove this when fixed
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['RCTRootView cancelTouches']);

AppRegistry.registerComponent(appName, () => App);
AppRegistry.runApplication(appName, { rootTag: document.getElementById('root') });
