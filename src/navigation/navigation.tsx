import React from 'react';

import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { createSwitchNavigator } from 'react-navigation';

import { darkTheme } from '../styles/themes/dark-theme';
import { lightTheme } from '../styles/themes/light-theme';
import { ITheme } from '../core/theme/itheme';
import { Theme } from '../core/theme/themes';
import { HeaderLeft } from '../components/header-left/header-left';
import {
    // DummyScreen,
    menuIcon,
    removeAnimation
} from './utils';

import { DashboardScreen } from '../screens/dashboard/dashboard';
import { SettingsScreen } from '../screens/settings/settings';
import { NetworkOptionsScreen } from '../screens/settings/network-options/network-options';
import { NetworkSelectionScreen } from '../screens/settings/network-selection/network-selection';
import { SetCurrencyScreen } from '../screens/settings/set-currency/set-currency';
import { BlockchainPortfolioScreen } from '../screens/settings/blockchain-portfolio/blockchain-portfolio';
import { OnboardingScreen } from '../screens/onboarding/onboarding';
import { CreateWalletTermsScreen } from '../screens/create-wallet-terms/create-wallet-terms';
import { CreateWalletMnemonicScreen } from '../screens/create-wallet-mnemonic/create-wallet-mnemonic';
import { AccountScreen } from '../screens/account/account';
import { SendScreen } from '../screens/send/send';
import { TermsConditionsScreen } from '../screens/terms-conditions/terms-conditions';
import { PrivacyPolicyScreen } from '../screens/privacy-policy/privacy-policy';
import { CreateWalletConfirmMnemonicScreen } from '../screens/create-wallet-confirm-mnemonic/create-wallet-confirm-mnemonic';
import { Animated } from 'react-native';
import { RecoverWalletScreen } from '../screens/recover-wallet/recover-wallet';
import { WalletsScreen } from '../screens/wallets/wallets';
import { ReceiveScreen } from '../screens/receive/receive';
import { ViewWalletMnemonicScreen } from '../screens/view-wallet-mnemonic/view-wallet-mnemonic';
import { TransactionDetails } from '../screens/transaction-details/transaction-details';
import { RewardsScreen } from '../screens/rewards/rewards';
import { WatchScreen } from '../screens/watch/watch';
import { AccountsScreen } from '../screens/accounts/accounts';
import { BASE_DIMENSION } from '../styles/dimensions';

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
            fontSize: 12,
            lineHeight: 15,
            fontWeight: '500',
            letterSpacing: 0.3
        },
        style: {
            padding: BASE_DIMENSION,
            height: 60
        },
        indicatorStyle: {
            display: 'none'
        },
        activeTintColor: {
            dark: darkTheme.colors.accent
        },
        inactiveTintColor: {
            dark: darkTheme.colors.textSecondary
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
        flex: 1,
        fontSize: 22,
        lineHeight: 28,
        opacity: 0.87,
        fontWeight: 'bold',
        color: themes[theme].colors.text,
        textAlign: 'center'
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
        },
        Send: {
            screen: SendScreen
        },
        Receive: {
            screen: ReceiveScreen
        },
        Accounts: {
            screen: AccountsScreen
        },
        Wallets: {
            screen: WalletsScreen
        },
        ViewWalletMnemonic: {
            screen: ViewWalletMnemonicScreen
        },
        TransactionDetails: {
            screen: TransactionDetails
        }
    },
    {
        initialRouteName: 'Dashboard',
        defaultNavigationOptions: defaultStackNavigationOptions,
        headerLayoutPreset: 'center',
        navigationOptions: ({ navigation }) => ({
            tabBarVisible: navigation.state.index < 1
        })
    }
);

// settings navigation stack
export const SettingsNavigation = createStackNavigator(
    {
        Settings: {
            screen: SettingsScreen
        },
        NetworkOptions: {
            screen: NetworkOptionsScreen
        },
        NetworkSelection: {
            screen: NetworkSelectionScreen
        },
        TermsConditions: {
            screen: TermsConditionsScreen
        },
        PrivacyPolicy: {
            screen: PrivacyPolicyScreen
        },
        Wallets: {
            screen: WalletsScreen
        },
        ViewWalletMnemonic: {
            screen: ViewWalletMnemonicScreen
        },
        SetCurrency: {
            screen: SetCurrencyScreen
        },
        BlockchainPortfolio: {
            screen: BlockchainPortfolioScreen
        }
    },
    {
        initialRouteName: 'Settings',
        defaultNavigationOptions: defaultStackNavigationOptions,
        headerLayoutPreset: 'center',
        navigationOptions: ({ navigation }) => ({
            tabBarVisible: navigation.state.index < 1
        })
    }
);

// rewards navigation stack
export const RewardsNavigation = createStackNavigator(
    {
        Rewards: {
            screen: RewardsScreen
        }
    },
    {
        initialRouteName: 'Rewards',
        defaultNavigationOptions: defaultStackNavigationOptions,
        headerLayoutPreset: 'center'
    }
);

// watch navigation stack
export const WatchNavigation = createStackNavigator(
    {
        Watch: {
            screen: WatchScreen
        }
    },
    {
        initialRouteName: 'Watch',
        defaultNavigationOptions: defaultStackNavigationOptions,
        headerLayoutPreset: 'center'
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
        screen: RewardsNavigation,
        headerTransparent: true,
        navigationOptions: () => ({
            tabBarIcon: menuIcon('accounting-coins-stack')
        })
    },
    Watch: {
        screen: WatchNavigation,
        headerTransparent: true,
        navigationOptions: () => ({
            tabBarIcon: menuIcon('view-1')
        })
    },
    Settings: {
        screen: SettingsNavigation,
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
        },
        TermsConditions: {
            screen: TermsConditionsScreen
        },
        PrivacyPolicy: {
            screen: PrivacyPolicyScreen
        },
        CreateWalletConfirmMnemonic: {
            screen: CreateWalletConfirmMnemonicScreen
        },
        RecoverWallet: {
            screen: RecoverWalletScreen
        }
    },
    {
        initialRouteName: 'CreateWalletMnemonic',
        defaultNavigationOptions: defaultStackNavigationOptions,
        // disable transition animation for CreateWalletTerms screen
        transitionConfig: () => ({
            transitionSpec: {
                timing: Animated.timing,
                useNativeDriver: true
            },
            screenInterpolator: removeAnimation(['CreateWalletTerms'])
        })
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
        initialRouteName: 'MainNavigation'
    }
);
