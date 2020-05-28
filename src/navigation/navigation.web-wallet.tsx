import { createStackNavigator } from 'react-navigation-stack';

import { DashboardScreen } from '../screens/dashboard/dashboard.web-wallet';

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
