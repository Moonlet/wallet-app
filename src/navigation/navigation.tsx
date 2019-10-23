import { DashboardScreen } from '../screens/dashboard/dashboard';
import { SettingsScreen } from '../screens/settings/settings';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { COLORS } from '../styles/colors';
import { DummyScreen, menuIcon } from './utils';

const mainTabsOptions: any = {
    tabBarPosition: 'bottom',
    tabBarOptions: {
        showIcon: true,
        labelStyle: {
            fontSize: 12
        },
        style: {
            backgroundColor: COLORS.SHARK_GRAY,
            padding: 6,
            height: 60
        },
        indicatorStyle: {
            display: 'none'
        },
        activeTintColor: COLORS.AQUA,
        inactiveTintColor: COLORS.LIGHT_GRAY
    },

    swipeEnabled: false
};

export const navigationConfig = {
    Wallet: {
        screen: DashboardScreen,
        navigationOptions: () => ({
            tabBarIcon: menuIcon('money-wallet-1')
        })
    },
    Rewards: {
        screen: DummyScreen,
        navigationOptions: () => ({
            tabBarIcon: menuIcon('accounting-coins-stack')
        })
    },
    Watch: {
        screen: DummyScreen,
        navigationOptions: () => ({
            tabBarIcon: menuIcon('view-1')
        })
    },
    Settings: {
        screen: SettingsScreen,
        headerTransparent: true,
        navigationOptions: () => ({
            tabBarIcon: menuIcon('cog'),
            title: 'Settings'
        })
    }
};

// TODO: fix deprecation warning related to react-native-gestures !
// https://github.com/kmagiera/react-native-gesture-handler/pull/657
// https://github.com/facebook/react-native/commit/36307d87e1974aff1abac598da2fd11c4e8e23c1
export const RootNavigation = createBottomTabNavigator(navigationConfig, mainTabsOptions);
