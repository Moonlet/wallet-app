import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar, Platform, AppState } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { RootNavigation } from './navigation/navigation';
import { store, persistor } from './redux/config';
import { PersistGate } from 'redux-persist/integration/react';
import { darkTheme } from './styles/themes/dark-theme';
import { ThemeContext } from './core/theme/theme-contex';
import { loadTranslations } from './core/i18n';
import { SplashScreen } from './components/splash-screen/splash-screen';
import { PasswordModal } from './components/password-modal/password-modal';
import { Notifications } from './core/messaging/notifications/notifications';
import { BottomSheet } from './components/bottom-sheet/bottom-sheet';
import { NavigationService } from './navigation/navigation-service';
import { Dialog } from './components/dialog/dialog';
import { getRemoteConfigFeatures } from './core/utils/remote-feature-config';
import { ImageCanvas } from './components/image-canvas/image-canvas';
import { takeOneAndSubscribeToStore } from './redux/utils/helpers';
import { LegalModal } from './components/legal/legal-modal/legal-modal';
import DeviceInfo from 'react-native-device-info';
import { setDeviceId } from './redux/preferences/actions';
import { AppStateStatus } from './core/constants/app';
import { TransactionRequestScreen } from './screens/transaction-request/transaction-request';
import { LoadingModal } from './components/loading-modal/loading-modal';
import { addBreadcrumb, captureException as SentryCaptureException } from '@sentry/react-native';
import { isEqual } from 'lodash';
import { filterObjectProps } from './core/utils/object-sanitise';
import { generateAccounts, setWalletsCredentials } from './redux/wallets/actions/wallet-actions';
import { ProcessTransactions } from './screens/pos-actions/process-transactions/process-transactions';
import { LedgerConnect } from './screens/ledger/ledger-connect';
import { updateTokenContracts } from './redux/tokens/actions';
import { ZilliqaTransactionUpdate } from './components/zilliqa-transaction-update/zilliqa-transaction-update';
import { ContextScreen } from './components/widgets/types';
import { fetchScreenData } from './redux/ui/screens/data/actions';
import { InfoModal } from './components/info-modal/info-modal';
import { ExtensionBackgroundRequest } from './screens/extension-background-request/extension-background-request';
import { UniversalLinks } from './core/universal-links';

const AppContainer = createAppContainer(RootNavigation);

interface IState {
    appReady: boolean;
    splashAnimationDone: boolean;
    appState: AppStateStatus;
    displayApplication: boolean;
    navigationState: any;
}

const PersistGateWrapper = props => {
    if (props.persistor) {
        return <PersistGate {...props}>{props.children}</PersistGate>;
    }
    return props.children;
};

export default class App extends React.Component<{}, IState> {
    public interval: any = null;
    private translationsLoaded: boolean = false;
    private reduxStateLoaded: boolean = false;
    private remoteFeatureConfigLoaded: boolean = false;
    private unsub: any;
    private notificationsConfigured: boolean = false;
    private securityChecksDone: boolean = true;

    constructor(props: any) {
        super(props);
        this.state = {
            appReady: false,
            splashAnimationDone: false,
            appState: AppState.currentState as AppStateStatus,
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
            UniversalLinks.configure(store.getState());

            this.notificationsConfigured = true;
        }

        this.setState({ appReady }, () => {
            if (
                this.state.appReady &&
                this.state.appState === AppStateStatus.ACTIVE &&
                Object.keys(store.getState().wallets).length >= 1
            ) {
                this.showPasswordModal();
            }
        });
    };

    public componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);

        store.dispatch(setDeviceId(DeviceInfo.getUniqueId()));

        setTimeout(
            () => this.setState({ splashAnimationDone: true }, () => this.updateAppReady()),
            1000
        );

        this.unsub = takeOneAndSubscribeToStore(store, () => {
            if (store.getState()?._persist?.rehydrated) {
                if (!this.reduxStateLoaded) {
                    this.reduxStateLoaded = true;

                    setTimeout(() => updateTokenContracts()(store.dispatch, store.getState), 3000);
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
        UniversalLinks.removeListeners();
    }

    public async showPasswordModal() {
        if (Platform.OS === 'web') {
            return;
        }

        try {
            const password = await PasswordModal.getPassword();
            store.dispatch(setWalletsCredentials(password) as any);
            store.dispatch(generateAccounts(password) as any);
        } catch (err) {
            SentryCaptureException(new Error(JSON.stringify(err)));
        }

        this.setState({
            displayApplication: true,
            appState: AppStateStatus.ACTIVE
        });
    }

    public handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (
            nextAppState === AppStateStatus.INACTIVE ||
            nextAppState === AppStateStatus.BACKGROUND
        ) {
            this.setState({ displayApplication: false });
        } else {
            this.setState({ displayApplication: true });
            if (this.state.appReady) {
                // Fetch screen data when return from background
                fetchScreenData({ screen: ContextScreen.DASHBOARD })(
                    store.dispatch,
                    store.getState
                );
            }
        }
        this.setState({ appState: nextAppState });
    };

    public renderApp() {
        const bgRequest = Platform.OS === 'web' && !!document.location.hash;
        if (bgRequest) {
            return <ExtensionBackgroundRequest />;
        } else {
            return (
                <AppContainer
                    ref={(nav: any) => NavigationService.setTopLevelNavigator(nav)}
                    theme="dark"
                    onNavigationStateChange={(_, newState) => {
                        if (!isEqual(this.state.navigationState, newState)) {
                            this.setState({ navigationState: newState });

                            const currentRoute = NavigationService.getCurrentRouteWithParams();

                            // Sentry Breadcrumbs
                            currentRoute &&
                                currentRoute?.routeName &&
                                addBreadcrumb({
                                    message: JSON.stringify({
                                        route: currentRoute.routeName,
                                        params:
                                            currentRoute?.params &&
                                            filterObjectProps(currentRoute.params, [
                                                'blockchain',
                                                'accountIndex',
                                                'step',
                                                'appNetworks',
                                                'transaction',
                                                'wallet.selectedBlockchain',
                                                'wallet.type',
                                                'wallet.hwOptions'
                                            ])
                                    })
                                });
                        }
                    }}
                />
            );
        }
    }

    public render() {
        if (this.state.appReady) {
            return (
                <Provider store={store}>
                    <PersistGateWrapper loading={null} persistor={persistor}>
                        <ThemeContext.Provider value={darkTheme}>
                            {Platform.OS !== 'web' && <PasswordModal.Component />}
                            {this.renderApp()}
                            {Platform.OS !== 'android' && !this.state.displayApplication && (
                                <ImageCanvas />
                            )}
                            <ProcessTransactions />
                            <TransactionRequestScreen />
                            <BottomSheet />
                            {Platform.OS !== 'web' && <Dialog.Component />}
                            <LoadingModal.Component />
                            <InfoModal.Component />
                            <LegalModal navigationState={this.state.navigationState} />
                            <LedgerConnect.Component />
                            <ZilliqaTransactionUpdate />
                        </ThemeContext.Provider>
                    </PersistGateWrapper>
                </Provider>
            );
        } else {
            return (
                <>
                    <SplashScreen />
                    {/* <SecurityChecks
                        onReady={() => {
                            this.securityChecksDone = true;
                            this.updateAppReady();
                        }}
                    /> */}
                </>
            );
        }
    }
}
