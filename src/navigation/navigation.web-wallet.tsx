import React from 'react';
import { ConnectWebWalletScreen } from '../screens/connect-web/connect-web-wallet';
import { createStackNavigator } from '@react-navigation/stack';
import { DashboardScreen } from '../screens/dashboard/dashboard.web-wallet';
import { ChartDataWebScreen } from '../screens/chart-data-web/chart-data-web';
import { NavigationContainer } from '@react-navigation/native';
import { ITheme } from '../core/theme/itheme';
import { darkTheme } from '../styles/themes/dark-theme';
import { lightTheme } from '../styles/themes/light-theme';
import { Theme } from '../core/theme/themes';

export const themes: { dark: ITheme; light: ITheme } = {
    [Theme.dark]: darkTheme,
    [Theme.light]: lightTheme
};

const defaultNavigationOptions = () => ({
    gestureEnabled: false,
    headerShown: false
});

const Stack = createStackNavigator();
// Web Wallet navigation stack
export const WebWalletNavigation = ({ theme }) => (
    <NavigationContainer theme={theme}>
        <Stack.Navigator initialRouteName={'ConnectWebWalletScreen'}>
            <Stack.Screen
                options={defaultNavigationOptions}
                component={DashboardScreen}
                name={'DashboardScreen'}
            />
            <Stack.Screen
                options={defaultNavigationOptions}
                component={ConnectWebWalletScreen}
                name={'ConnectWebWalletScreen'}
            />
            <Stack.Screen
                options={defaultNavigationOptions}
                component={ChartDataWebScreen}
                name={'ChartDataWebScreen'}
            />
        </Stack.Navigator>
    </NavigationContainer>
);
