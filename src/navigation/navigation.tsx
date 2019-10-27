import React from 'react';

import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator } from 'react-navigation';

import { DashboardScreen } from '../screens/dashboard/dashboard';
import { SettingsScreen } from '../screens/settings/settings';
import { OnboardingScreen } from '../screens/onboarding/onboarding';

import { CreateWalletTermsScreen } from '../screens/create-wallet-terms/create-wallet-terms';
import { CreateWalletMnemonicScreen } from '../screens/create-wallet-mnemonic/create-wallet-mnemonic';
import { DummyScreen, menuIcon } from './utils';
import { AccountScreen } from '../screens/account/account';
import { darkTheme } from '../styles/themes/dark-theme';
import { lightTheme } from '../styles/themes/light-theme';
import { ITheme } from '../core/theme/itheme';
import { Theme } from '../core/theme/themes';
import { HeaderLeft } from '../components/header-left/header-left';

interface IDefaultNavOptions {
    navigation: any;
    theme: Theme;
}

export const themes: { dark: ITheme; light: ITheme } = {
    [Theme.dark]: darkTheme,
    [Theme.light]: lightTheme
};

const mainTabbedNavigationOptions: any = {
    tabBarPosition: 'bottom',
    tabBarOptions: {
        showIcon: true,
        labelStyle: {
            fontSize: 12
        },
        style: {
            padding: 6,
            height: 60
        },
        indicatorStyle: {
            display: 'none'
        },
        activeTintColor: {
            dark: darkTheme.colors.accent
        },
        inactiveTintColor: {
            dark: darkTheme.colors.textDarker
        }
    },

    swipeEnabled: false
};

export const defaultStackNavigationOptions: any = ({ navigation, theme }: IDefaultNavOptions) => ({
    headerStyle: {
        backgroundColor: themes[theme].colors.appBackground,
        borderBottomWidth: 0
    },
    headerTitleStyle: {
        fontWeight: 'bold'
    },
    headerLeft:
        navigation.dangerouslyGetParent().state.index > 0 ? (
            <HeaderLeft
                icon="arrow-left-1"
                text="Back"
                onPress={() => {
                    navigation.goBack(null);
                }}
            />
        ) : null
});

// wallet navigation stack
export const WalletNavigation = createStackNavigator(
    {
        Dashboard: {
            screen: DashboardScreen
        },
        Account: {
            screen: AccountScreen
        }
    },
    {
        initialRouteName: 'Dashboard',
        defaultNavigationOptions: defaultStackNavigationOptions
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
            tabBarIcon: menuIcon('cog')
        })
    }
};

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
        defaultNavigationOptions: defaultStackNavigationOptions
    }
);

// main bottom bar navigation
export const MainNavigation = createBottomTabNavigator(
    navigationConfig,
    mainTabbedNavigationOptions
);

export const RootNavigation = createSwitchNavigator(
    {
        OnboardingScreen,
        MainNavigation,
        CreateWalletNavigation
    },
    {
        // initialRouteName: 'OnboardingScreen'
        initialRouteName: 'MainNavigation'
    }
);
