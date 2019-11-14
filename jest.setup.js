import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';
import { NativeModules } from 'react-native';
import { randomBytes } from 'crypto';

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
        createStackNavigator: jest.fn(),
        StackViewStyleInterpolator: {
            forHorizontal: jest.fn().mockReturnValue('animation-interpolation')
        }
    };
});

NativeModules.SettingsManager = { settings: { AppleLocale: 'en_US' } };
NativeModules.I18nManager = {
    localeIdentifier: 'en-US',
    getConstants: jest.fn().mockReturnValue({ isRTL: false, doLeftAndRightSwapInRTL: true })
};

NativeModules.RNGestureHandlerModule = {
    Directions: {}
};

jest.mock('react-native-device-info', () => {
    return {
        getVersion: jest.fn()
    };
});

NativeModules.RNRandomBytes = {
    randomBytes: jest.fn(randomBytes)
};
NativeModules.SettingsManager = { settings: { AppleLocale: 'en-US' } };
NativeModules.Aes = {
    pbkdf2: jest.fn().mockReturnValue('hashedkey'),
    randomKey: jest.fn(() => Promise.resolve('randomKey')),
    encrypt: jest.fn(() => Promise.resolve('encrypted')),
    decrypt: jest.fn().mockReturnValue('data')
};
