import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import { NativeModules } from 'react-native';

Enzyme.configure({ adapter: new Adapter() });

// Mocks
jest.mock('react-navigation', () => {
    return {
        createAppContainer: jest.fn().mockReturnValue(function NavigationContainer(props) {
            return null;
        }),
        createSwitchNavigator: jest.fn(),
        NavigationActions: {
            navigate: jest.fn().mockReturnValue('navigate-action')
        }
    };
});

jest.mock('react-navigation-tabs', () => {
    return {
        createBottomTabNavigator: jest.fn()
    };
});

jest.mock('react-navigation-stack', () => {
    return {
        createStackNavigator: jest.fn()
    };
});

NativeModules.SettingsManager = { settings: { AppleLocale: 'en_US' } };
NativeModules.I18nManager = { localeIdentifier: 'en-US' };
NativeModules.RNRandomBytes = { seed: 'a' };

jest.mock('react-native-device-info', () => {
    return {
        getVersion: jest.fn()
    };
});

NativeModules.SettingsManager = { settings: { AppleLocale: 'en-US' } };
