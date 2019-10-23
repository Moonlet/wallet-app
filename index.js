import { AppRegistry, Platform } from 'react-native';
import App from './src/app';
import { name as appName } from './app.json';

// TODO remove this when fixed
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['RCTRootView cancelTouches']);

AppRegistry.registerComponent(appName, () => App);

if (Platform.OS === 'web') {
    AppRegistry.runApplication(appName, { rootTag: document.getElementById('root') });
}
