import HomeScreen from './screens/home/home';
import SettingsScreen from './screens/settings/settings';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

const mainTabsOptions: any = {
    tabBarPosition: 'bottom',
    tabBarOptions: {
        labelStyle: {
            fontSize: 12
        },
        style: {
            backgroundColor: 'rgba(35, 35, 38, 0.72)'
        },
        indicatorStyle: {
            display: 'none'
        }
    }
};

// TODO: fix deprecation warning related to react-native-gestures
// https://github.com/kmagiera/react-native-gesture-handler/pull/657
// https://github.com/facebook/react-native/commit/36307d87e1974aff1abac598da2fd11c4e8e23c1
export const RootNavigation = createMaterialTopTabNavigator(
    {
        Home: { screen: HomeScreen },
        Settings: { screen: SettingsScreen }
    },
    mainTabsOptions
);
