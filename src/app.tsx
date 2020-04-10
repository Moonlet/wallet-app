import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar, Platform, AppState, AppStateStatus } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { RootNavigation } from './navigation/navigation';
import { store } from './redux/config';
import { PersistGate } from 'redux-persist/integration/react';
import { darkTheme } from './styles/themes/dark-theme';
import { ThemeContext } from './core/theme/theme-contex';
import { loadTranslations } from './core/i18n';
import { persistStore } from 'redux-persist';
import { SplashScreen } from './components/splash-screen/splash-screen';
import { PasswordModal } from './components/password-modal/password-modal';
import { Notifications } from './core/messaging/notifications/notifications';
import { setupVoipNotification } from './core/messaging/silent/ios-voip-push-notification';
import { BottomSheet } from './components/bottom-sheet/bottom-sheet';
import { WalletConnectClient } from './core/wallet-connect/wallet-connect-client';
import { WalletConnectWeb } from './core/wallet-connect/wallet-connect-web';
import { NavigationService } from './navigation/navigation-service';
import { Dialog } from './components/dialog/dialog';
import { getRemoteConfigFeatures } from './core/utils/remote-feature-config';
import { ImageCanvas } from './components/image-canvas/image-canvas';
import { LoadingModal } from './components/loading-modal/loading-modal';
import { subscribeExchangeRates } from './core/utils/exchange-rates';
import { updateExchangeRates } from './redux/market/actions';
import { takeOneAndSubscribeToStore } from './redux/utils/helpers';
import { LegalModal } from './components/legal/legal-modal/legal-modal';
import { IExchangeRates } from './redux/market/state';
import { updateAddressMonitorTokens } from './core/address-monitor';
import DeviceInfo from 'react-native-device-info';
import { setDeviceId } from './redux/preferences/actions';
import { SecurityChecks } from './components/security-checks/security-checks';

const AppContainer = createAppContainer(RootNavigation);

const persistor = persistStore(store);

const APP_STATE_ACTIVE: AppStateStatus = 'active';
const APP_STATE_BACKGROUND: AppStateStatus = 'background';
const APP_STATE_INACTIVE: AppStateStatus = 'inactive';

interface IState {
    appReady: boolean;
    splashAnimationDone: boolean;
    appState: AppStateStatus;
    displayApplication: boolean;
    navigationState: any;
}

WalletConnectClient.setStore(store);
WalletConnectWeb.setStore(store);

export default class App extends React.Component<{}, IState> {
    public interval: any = null;
    private translationsLoaded: boolean = false;
    private reduxStateLoaded: boolean = false;
    private remoteFeatureConfigLoaded: boolean = false;
    private unsub: any;
    private notificationsConfigured: boolean = false;
    private securityChecksDone: boolean = false;

    constructor(props: any) {
        super(props);
        this.state = {
            appReady: false,
            splashAnimationDone: false,
            appState: AppState.currentState,
            displayApplication: true,
            navigationState: undefined
        };

        getRemoteConfigFeatures().then(() => {
            this.remoteFeatureConfigLoaded = true;
            this.updateAppReady();
        });

        loadTranslations('en').then(() => {
            this.translationsLoaded = true;
            this.updateAppReady();
        });

        // decide the bar style on lightTheme
        StatusBar.setBarStyle('light-content', true);
    }

    public updateAppReady = () => {
        const appReady =
            this.securityChecksDone &&
            this.translationsLoaded &&
            this.reduxStateLoaded &&
            this.state.splashAnimationDone &&
            this.remoteFeatureConfigLoaded;

        if (appReady && !this.notificationsConfigured) {
            Notifications.configure();

            if (Platform.OS === 'ios') {
                setupVoipNotification();
            }

            this.notificationsConfigured = true;
        }

        this.setState({ appReady }, () => {
            if (
                this.state.appReady &&
                this.state.appState === APP_STATE_ACTIVE &&
                Object.keys(store.getState().wallets).length >= 1
            ) {
                this.showPasswordModal();
            }
        });

        if (appReady && Platform.OS !== 'web') {
            updateAddressMonitorTokens(store.getState().wallets);
        }
    };

    public componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);

        store.dispatch(setDeviceId(DeviceInfo.getUniqueId()));

        setTimeout(
            () => this.setState({ splashAnimationDone: true }, () => this.updateAppReady()),
            1000
        );

        this.unsub = takeOneAndSubscribeToStore(store, () => {
            if (store.getState()._persist.rehydrated) {
                if (!this.reduxStateLoaded) {
                    this.reduxStateLoaded = true;

                    subscribeExchangeRates((exchangeRates: IExchangeRates) => {
                        if (exchangeRates) {
                            store.dispatch(updateExchangeRates(exchangeRates));
                        }
                    });

                    // trigger extension getState after state was loaded from storage
                    Platform.OS === 'web' &&
                        WalletConnectWeb.isConnected() &&
                        WalletConnectWeb.getState();

                    this.updateAppReady();
                }
            }

            if (this.reduxStateLoaded) {
                this.unsub && this.unsub();
            }
        });
    }

    public componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
        Notifications.removeListeners();
    }

    public async showPasswordModal() {
        if (Platform.OS === 'web') {
            return;
        }

        try {
            const isVisible = await PasswordModal.isVisible();
            if (!isVisible) await PasswordModal.getPassword();
        } catch (err) {
            //
        }

        this.setState({
            displayApplication: true,
            appState: APP_STATE_ACTIVE
        });
    }

    public handleAppStateChange = (nextAppState: AppStateStatus) => {
        const { appState } = this.state;

        if (nextAppState === APP_STATE_INACTIVE || nextAppState === APP_STATE_BACKGROUND) {
            this.setState({ displayApplication: false });
        } else {
            this.setState({ displayApplication: true });
        }

        if (
            (appState === APP_STATE_BACKGROUND || appState === APP_STATE_INACTIVE) &&
            nextAppState === APP_STATE_ACTIVE &&
            Object.keys(store.getState().wallets).length >= 1 &&
            store.getState().ui.passwordModal.displayPasswordModal === true
        ) {
            this.showPasswordModal();
        }
        this.setState({ appState: nextAppState });
    };

    public render() {
        if (this.state.appReady) {
            return (
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <ThemeContext.Provider value={darkTheme}>
                            <AppContainer
                                ref={(nav: any) => NavigationService.setTopLevelNavigator(nav)}
                                theme="dark"
                                onNavigationStateChange={(_, newState) => {
                                    this.setState({ navigationState: newState });
                                }}
                            />
                            {!this.state.displayApplication && <ImageCanvas />}
                            <PasswordModal.Component />
                            <BottomSheet />
                            {Platform.OS !== 'web' && <Dialog.Component />}
                            <LoadingModal />
                            <LegalModal navigationState={this.state.navigationState} />
                        </ThemeContext.Provider>
                    </PersistGate>
                </Provider>
            );
        } else {
            return (
                <>
                    <SplashScreen />
                    <SecurityChecks
                        onReady={() => {
                            this.securityChecksDone = true;
                            this.updateAppReady();
                        }}
                    />
                </>
            );
        }
    }
}
