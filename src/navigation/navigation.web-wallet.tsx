import { createStackNavigator } from 'react-navigation-stack';

import { DashboardScreen } from '../screens/dashboard/dashboard.web-wallet';
import { ITheme } from '../core/theme/itheme';
import { darkTheme } from '../styles/themes/dark-theme';
import { lightTheme } from '../styles/themes/light-theme';
import { Theme } from '../core/theme/themes';

export const themes: { dark: ITheme; light: ITheme } = {
    [Theme.dark]: darkTheme,
    [Theme.light]: lightTheme
};

// Web Wallet navigation stack
export const WebWalletNavigation = createStackNavigator(
    {
        Dashboard: {
            screen: DashboardScreen
        }
    },
    {
        initialRouteName: 'Dashboard',
        headerMode: 'none'
    }
);
