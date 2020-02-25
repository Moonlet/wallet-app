import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar, Platform, AppState, AppStateStatus } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { RootNavigation } from './navigation/navigation';
import configureStore from './redux/config';
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
import { fetchExchangeRates } from './core/utils/exchange-rates';
import { updateExchangeRates } from './redux/market/actions';

const AppContainer = createAppContainer(RootNavigation);

const store = configureStore();
const persistor = persistStore(store);

const APP_STATE_ACTIVE: AppStateStatus = 'active';
const APP_STATE_BACKGROUND: AppStateStatus = 'background';
const APP_STATE_INACTIVE: AppStateStatus = 'inactive';

interface IState {
    appReady: boolean;
    splashAnimationDone: boolean;
    appState: AppStateStatus;
    showPasswordModal: boolean;
    displayApplication: boolean;
}

WalletConnectClient.setStore(store);
WalletConnectWeb.setStore(store);

const takeOneAndSubscribeToStore = (reduxStore, callback) => {
    const state = reduxStore?.getState();

    if (state) {
        callback(state);
    }

    return reduxStore.subscribe(() => callback(reduxStore.getState()));
};

export default class App extends React.Component<{}, IState> {
    public interval: any = null;
    private translationsLoaded: boolean = false;
    private reduxStateLoaded: boolean = false;
    private remoteFeatureConfigLoaded: boolean = false;
    private extensionStateLoaded: boolean =
        Platform.OS === 'web' && WalletConnectWeb.isConnected() ? false : true;
    private unsub: any;
    private notificationsConfigured: boolean = false;

    constructor(props: any) {
        super(props);
        this.state = {
            appReady: false,
            splashAnimationDone: false,
            appState: AppState.currentState,
            showPasswordModal: false,
            displayApplication: true
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
        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(darkTheme.colors.appBackground);
        }
    }

    public updateAppReady = () => {
        const appReady =
            this.translationsLoaded &&
            this.reduxStateLoaded &&
            this.extensionStateLoaded &&
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
    };

    public componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);

        setTimeout(
            () => this.setState({ splashAnimationDone: true }, () => this.updateAppReady()),
            1000
        );

        this.unsub = takeOneAndSubscribeToStore(store, () => {
            if (store.getState()._persist.rehydrated) {
                if (!this.reduxStateLoaded) {
                    this.reduxStateLoaded = true;

                    fetchExchangeRates((exchangeRates: { [tokenType: string]: number }) => {
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

            if (Platform.OS === 'web' && store.getState().ui.extension.stateLoaded) {
                if (!this.extensionStateLoaded) {
                    this.extensionStateLoaded = true;
                    this.updateAppReady();
                }
            }

            if (this.reduxStateLoaded && this.extensionStateLoaded) {
                this.unsub && this.unsub();
            }
        });
    }

    public componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
        Notifications.removeListeners();
    }

    public showPasswordModal() {
        if (Platform.OS === 'web') {
            return;
        }
        this.setState({
            showPasswordModal: true,
            displayApplication: true,
            appState: APP_STATE_ACTIVE
        });
    }

    public handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (nextAppState === APP_STATE_INACTIVE || nextAppState === APP_STATE_BACKGROUND) {
            this.setState({
                displayApplication: false
            });
        } else {
            this.setState({
                displayApplication: true
            });
        }

        if (
            this.state.appState === APP_STATE_BACKGROUND &&
            nextAppState === APP_STATE_ACTIVE &&
            Object.keys(store.getState().wallets).length >= 1 &&
            store.getState().ui.screens.connectHardwareWallet.connectInProgress === false
        ) {
            this.showPasswordModal();
        }
        this.setState({ appState: nextAppState });
    };

    public render() {
        if (this.state.appReady) {
            // this.unsubscribe();
            return (
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <ThemeContext.Provider value={darkTheme}>
                            <AppContainer
                                ref={(nav: any) => NavigationService.setTopLevelNavigator(nav)}
                                theme="dark"
                            />
                            {!this.state.displayApplication && <ImageCanvas />}
                            <PasswordModal
                                visible={this.state.showPasswordModal}
                                onPassword={() =>
                                    this.setState({
                                        showPasswordModal: false,
                                        displayApplication: true
                                    })
                                }
                            />
                            <BottomSheet />
                            <Dialog.Component />
                            <LoadingModal />
                        </ThemeContext.Provider>
                    </PersistGate>
                </Provider>
            );
        } else {
            return <SplashScreen />;
        }
    }
}
