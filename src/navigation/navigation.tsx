import React from 'react';

import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator, StackViewTransitionConfigs } from 'react-navigation-stack';
import { createSwitchNavigator } from 'react-navigation';

import { darkTheme } from '../styles/themes/dark-theme';
import { lightTheme } from '../styles/themes/light-theme';
import { ITheme } from '../core/theme/itheme';
import { Theme } from '../core/theme/themes';
import { HeaderLeft } from '../components/header-left/header-left';
import { menuIcon } from './utils';

import { DashboardScreen } from '../screens/dashboard/dashboard';
import { SettingsScreen } from '../screens/settings/settings';
import { NetworkOptionsScreen } from '../screens/settings/network-options/network-options';
import { NetworkSelectionScreen } from '../screens/settings/network-selection/network-selection';
import { SetCurrencyScreen } from '../screens/settings/set-currency/set-currency';
import { BlockchainPortfolioScreen } from '../screens/settings/blockchain-portfolio/blockchain-portfolio';
import { BackupWalletScreen } from '../screens/settings/backup-wallet/backup-wallet';
import { OnboardingScreen } from '../screens/onboarding/onboarding';
import { CreateWalletMnemonicScreen } from '../screens/create-wallet-mnemonic/create-wallet-mnemonic';
import { TokenScreen } from '../screens/token/token';
import { SendScreen } from '../screens/send/send';
import { TermsConditionsScreen } from '../screens/terms-conditions/terms-conditions';
import { PrivacyPolicyScreen } from '../screens/privacy-policy/privacy-policy';
import { CreateWalletConfirmMnemonicScreen } from '../screens/create-wallet-confirm-mnemonic/create-wallet-confirm-mnemonic';
import { RecoverWalletScreen } from '../screens/recover-wallet/recover-wallet';
import { WalletsScreen } from '../screens/wallets/wallets';
import { ReceiveScreen } from '../screens/receive/receive';
import { ViewWalletMnemonicScreen } from '../screens/view-wallet-mnemonic/view-wallet-mnemonic';
import { TransactionsHistoryScreen } from '../screens/transactions-history/transactions-history';
import { TransactionDetails } from '../screens/transaction-details/transaction-details';
import { ManageAccountsScreen } from '../screens/manage-accounts/manage-accounts';
import {
    BASE_DIMENSION,
    normalize,
    normalizeFontAndLineHeight,
    LETTER_SPACING,
    normalizeLetterSpacing
} from '../styles/dimensions';
import { ConnectHardwareWallet } from '../screens/connect-hardware-wallet/connect-hardware-wallet';
import { ManageTokenScreen } from '../screens/manage-token/manage-token';
import { ConnectExtensionScreen } from '../screens/connect-extension/connect-extension';
import { ValidatorScreen } from '../screens/validator-screen/validator-screen';
import { QuickDelegateSelectValidator } from '../screens/pos-actions/pos-action-quick-delegate/quick-delegate-select-validator/quick-delegate-select-validator';
import { PosBasicAction } from '../screens/pos-actions/pos-basic-action/pos-basic-action';
import { DelegateEnterAmount } from '../screens/pos-actions/pos-action-delegate/delegate-enter-amount/delegate-enter-amount';
import { QuickDelegateEnterAmount } from '../screens/pos-actions/pos-action-quick-delegate/quick-delegate-enter-amount/quick-delegate-enter-amount';
import { IconValues } from '../components/icon/values';
import { RedelegateSelectValidator } from '../screens/pos-actions/pos-action-redelegate/redelegate-select-validator/redelegate-select-validator';
import { RedelegateEnterAmount } from '../screens/pos-actions/pos-action-redelegate/redelegate-enter-amount/redelegate-enter-amount';
import { RedelegateConfirm } from '../screens/pos-actions/pos-action-redelegate/redelegate-confirm/redelegate-confirm';
import { NotificationsScreen } from '../screens/notifications/notifications';
import { CreateNearAccountScreen } from '../screens/blockchain/near/create-account/create-account';
import { RecoverNearAccountScreen } from '../screens/blockchain/near/recover-account/recover-account';
import { AddTokenScreen } from '../screens/token/components/add-token/add-token';
import { SmartScanScreen } from '../screens/smart-scan/smart-scan';
import { Platform } from 'react-native';
import { QuickStakeSelectValidatorScreen } from '../screens/quick-stake-select-validator/quick-stake-select-validator';
import { PromoDetailsScreen } from '../screens/promo-details/promo-details';
import { SmartScreen } from '../screens/smart-screen/smart-screen';
import { ConnectedWebsitesScreen } from '../screens/connected-websites/connected-websites';

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
            fontSize: normalizeFontAndLineHeight(12),
            lineHeight: normalizeFontAndLineHeight(15),
            fontWeight: '500',
            letterSpacing: normalizeLetterSpacing(0.3)
        },
        style: {
            padding: BASE_DIMENSION,
            height: normalize(60)
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
        elevation: 0,
        borderBottomWidth: 0
    },
    headerTitleStyle: {
        flex: 1,
        fontSize: normalizeFontAndLineHeight(22),
        lineHeight: normalizeFontAndLineHeight(28),
        color: themes[theme].colors.text,
        letterSpacing: LETTER_SPACING,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    headerLeft: navigation.dangerouslyGetParent().state.index > 0 && (
        <HeaderLeft
            testID="go-back"
            icon={IconValues.ARROW_LEFT}
            onPress={() => navigation.goBack(null)}
        />
    )
});

// wallet navigation stack
export const WalletNavigation = createStackNavigator(
    {
        Dashboard: {
            screen: DashboardScreen
        },
        Token: {
            screen: TokenScreen
        },
        Send: {
            screen: SendScreen
        },
        Receive: {
            screen: ReceiveScreen
        },
        Wallets: {
            screen: WalletsScreen
        },
        ViewWalletMnemonic: {
            screen: ViewWalletMnemonicScreen
        },
        TransactonsHistory: {
            screen: TransactionsHistoryScreen
        },
        TransactionDetails: {
            screen: TransactionDetails
        },
        ManageAccounts: {
            screen: ManageAccountsScreen
        },
        AddToken: {
            screen: AddTokenScreen
        },
        ManageToken: {
            screen: ManageTokenScreen
        },
        ConnectExtension: {
            screen: ConnectExtensionScreen
        },
        Validator: {
            screen: ValidatorScreen
        },
        PosDelegate: {
            screen: DelegateEnterAmount
        },
        DelegateEnterAmount: {
            screen: DelegateEnterAmount
        },
        Notifications: {
            screen: NotificationsScreen
        },
        ConnectedWebsites: {
            screen: ConnectedWebsitesScreen
        },
        CreateNearAccount: {
            screen: CreateNearAccountScreen
        },
        RecoverNearAccount: {
            screen: RecoverNearAccountScreen
        },
        PromoDetails: {
            screen: PromoDetailsScreen
        },

        QuickStakeSelectValidator: {
            screen: QuickStakeSelectValidatorScreen
        },
        PosQuickDelegate: {
            screen: QuickDelegateSelectValidator
        },
        QuickDelegateEnterAmount: {
            screen: QuickDelegateEnterAmount
        },
        PosRedelegate: {
            screen: RedelegateSelectValidator
        },
        RedelegateEnterAmount: {
            screen: RedelegateEnterAmount
        },
        RedelegateConfirm: {
            screen: RedelegateConfirm
        },
        PosBasicAction: {
            screen: PosBasicAction
        },
        SmartScreen: {
            screen: SmartScreen
        },

        // wallet creation
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
        },
        ConnectHardwareWallet: {
            screen: ConnectHardwareWallet
        }
    },
    {
        initialRouteName: 'Dashboard',
        defaultNavigationOptions: defaultStackNavigationOptions,
        headerLayoutPreset: 'center',
        navigationOptions: ({ navigation }) => ({
            tabBarVisible: navigation.state.index < 1
        }),
        transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS
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
        },
        BackupWallet: {
            screen: BackupWalletScreen
        },
        ConnectExtension: {
            screen: ConnectExtensionScreen
        },
        SmartScreen: {
            screen: SmartScreen
        },

        // wallet creation
        CreateWalletMnemonic: {
            screen: CreateWalletMnemonicScreen
        },
        CreateWalletConfirmMnemonic: {
            screen: CreateWalletConfirmMnemonicScreen
        },
        RecoverWallet: {
            screen: RecoverWalletScreen
        },
        ConnectHardwareWallet: {
            screen: ConnectHardwareWallet
        }
    },
    {
        initialRouteName: 'Settings',
        defaultNavigationOptions: defaultStackNavigationOptions,
        headerLayoutPreset: 'center',
        navigationOptions: ({ navigation }) => ({
            tabBarVisible: navigation.state.index < 1
        }),
        transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS
    }
);

// TODO: refactor this to create Smart Scan
export const ScanNavigation = createStackNavigator(
    {
        SmartScan: {
            screen: SmartScanScreen
        }
    },
    {
        initialRouteName: 'SmartScan',
        defaultNavigationOptions: defaultStackNavigationOptions,
        headerLayoutPreset: 'center',
        navigationOptions: ({ navigation }) => ({
            tabBarVisible: navigation.state.index < 1
        }),
        transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS
    }
);

// main dashboard navigation
export const navigationConfig = {
    Dashboard: {
        screen: WalletNavigation,
        navigationOptions: () => ({
            tabBarIcon: menuIcon(IconValues.DASHBOARD)
        })
    },
    Scan: {
        screen: ScanNavigation,
        headerTransparent: true,
        navigationOptions: () => ({
            tabBarIcon: menuIcon(IconValues.QR_CODE_SCAN)
        })
    },
    Settings: {
        screen: SettingsNavigation,
        headerTransparent: true,
        navigationOptions: () => ({
            tabBarIcon: menuIcon(IconValues.SETTINGS)
        })
    }
};

if (Platform.OS === 'web') {
    delete navigationConfig.Scan;
}

// wallet creation flow stack
export const OnboardingNavigation = createStackNavigator(
    {
        Onboarding: {
            screen: OnboardingScreen
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
        },
        ConnectHardwareWallet: {
            screen: ConnectHardwareWallet
        }
    },
    {
        initialRouteName: 'Onboarding',
        defaultNavigationOptions: defaultStackNavigationOptions,
        headerLayoutPreset: 'center',
        transitionConfig: () => StackViewTransitionConfigs.SlideFromRightIOS
    }
);

// main bottom bar navigation
export const MainNavigation = createBottomTabNavigator(
    navigationConfig,
    mainTabbedNavigationOptions
);

export const RootNavigation = createSwitchNavigator(
    {
        MainNavigation,
        OnboardingNavigation
    },
    {
        initialRouteName: 'MainNavigation'
    }
);
