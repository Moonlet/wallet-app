import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator } from 'react-navigation';

import { DashboardScreen } from '../screens/dashboard/dashboard';
import { SettingsScreen } from '../screens/settings/settings';
import { OnboardingScreen } from '../screens/onboarding/onboarding';

import { COLORS } from '../styles/colors';
import { CreateWalletTermsScreen } from '../screens/create-wallet-terms/create-wallet-terms';
import { CreateWalletMnemonicScreen } from '../screens/create-wallet-mnemonic/create-wallet-mnemonic';
import { DummyScreen, menuIcon } from './utils';
import { AccountScreen } from '../screens/account/account';

const mainTabbedNavigationOptions: any = {
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

// wallet navigation stack
export const WalletNavigation = createStackNavigator(
    {
        Dashboard: {
            screen: DashboardScreen,
            navigationOptions: {
                header: null
            }
        },
        Account: {
            screen: AccountScreen,
            navigationOptions: {
                header: null
            }
        }
    },
    {
        initialRouteName: 'Dashboard',
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: COLORS.SHARK_GRAY
            },
            headerTitleStyle: {
                fontWeight: 'bold'
            }
        }
    }
);

// main dashboard navigation
export const navigationConfig = {
    Wallet: {
        screen: WalletNavigation,
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

export const MainNavigation = createBottomTabNavigator(
    navigationConfig,
    mainTabbedNavigationOptions
);

// wallet creation flow stack
export const CreateWalletNavigation = createStackNavigator(
    {
        CreateWalletTerms: {
            screen: CreateWalletTermsScreen
        },
        CreateWalletMnemonic: {
            screen: CreateWalletMnemonicScreen
        }
    },
    {
        initialRouteName: 'CreateWalletTerms',
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: COLORS.SHARK_GRAY
            },
            headerTitleStyle: {
                fontWeight: 'bold'
            }
        }
    }
);

export const RootNavigation = createSwitchNavigator(
    {
        OnboardingScreen,
        MainNavigation,
        CreateWalletNavigation
    },
    {
        initialRouteName: 'OnboardingScreen'
        // initialRouteName: 'MainNavigation'
    }
);
