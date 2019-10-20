import * as React from 'react';
import { DashboardScreen } from '../screens/dashboard/dashboard';
import { SettingsScreen } from '../screens/settings/settings';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { View, Text } from 'react-native';
import { Icon } from '../components/icon';
import { COLORS } from '../styles/colors';

const mainTabsOptions: any = {
    tabBarPosition: 'bottom',
    tabBarOptions: {
        showIcon: true,
        labelStyle: {
            fontSize: 12
        },
        style: {
            backgroundColor: '#232326',
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

const Screen = () => (
    <View style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
        <Text style={{ textAlign: 'center' }}>some screen</Text>
    </View>
);

const menuIcon = (icon: string) => ({ focused }: any) => (
    <Icon name={icon} size={25} style={{ color: focused ? COLORS.AQUA : COLORS.LIGHT_GRAY }} />
);

// TODO: fix deprecation warning related to react-native-gestures
// https://github.com/kmagiera/react-native-gesture-handler/pull/657
// https://github.com/facebook/react-native/commit/36307d87e1974aff1abac598da2fd11c4e8e23c1
export const RootNavigation = createBottomTabNavigator(
    {
        Wallet: {
            screen: DashboardScreen,
            navigationOptions: () => ({
                tabBarIcon: menuIcon('money-wallet-1')
            })
        },
        Rewards: {
            screen: Screen,
            navigationOptions: () => ({
                tabBarIcon: menuIcon('accounting-coins-stack')
            })
        },
        Watch: {
            screen: Screen,
            navigationOptions: () => ({
                tabBarIcon: menuIcon('view-1')
            })
        },
        Settings: {
            screen: SettingsScreen,
            navigationOptions: () => ({
                tabBarIcon: menuIcon('cog')
            })
        }
    },
    mainTabsOptions
);
