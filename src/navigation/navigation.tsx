import { DashboardScreen } from '../screens/dashboard/dashboard';
import { SettingsScreen } from '../screens/settings/settings';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

const mainTabsOptions: any = {
    tabBarPosition: 'bottom',
    tabBarOptions: {
        labelStyle: {
            fontSize: 12
        },
        style: {
            backgroundColor: 'rgba(35, 35, 38, 1)'
        },
        indicatorStyle: {
            display: 'none'
        }
    },
    swipeEnabled: false
};

// TODO: fix deprecation warning related to react-native-gestures
// https://github.com/kmagiera/react-native-gesture-handler/pull/657
// https://github.com/facebook/react-native/commit/36307d87e1974aff1abac598da2fd11c4e8e23c1
export const RootNavigation = createMaterialTopTabNavigator(
    {
        Dashboard: { screen: DashboardScreen },
        Settings: { screen: SettingsScreen }
    },
    mainTabsOptions
);
