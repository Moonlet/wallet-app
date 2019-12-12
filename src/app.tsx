import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar, Platform, AppState } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { RootNavigation } from './navigation/navigation';
import configureStore from './redux/config';
import { PersistGate } from 'redux-persist/integration/react';
import { darkTheme } from './styles/themes/dark-theme';
import { ThemeContext } from './core/theme/theme-contex';
import { loadTranslations } from './core/i18n';
import { persistStore } from 'redux-persist';
import { SplashScreen } from './components/splash-screen/splash-screen';
import { Notification } from './messaging/notifications';
import { PasswordModal } from './components/password-modal/password-modal';

const AppContainer = createAppContainer(RootNavigation);

const store = configureStore();
const persistor = persistStore(store);

interface IState {
    appReady: boolean;
    splashAnimationDone: boolean;
    appState: string;
}

export default class App extends React.Component<{}, IState> {
    public interval: any = null;
    public passwordModal = null;
    private translationsLoaded: boolean = false;
    private reduxStateLoaded: boolean = false;

    constructor(props: any) {
        super(props);
        this.state = {
            appReady: false,
            splashAnimationDone: false,
            appState: AppState.currentState
        };

        loadTranslations('en').then(() => {
            this.translationsLoaded = true;
            this.updateAppReady();
        });
        store.subscribe(() => {
            if (store.getState()._persist.rehydrated === true) {
                this.reduxStateLoaded = true;
                this.updateAppReady();
            }
        });

        // decide the bar style on lightTheme
        StatusBar.setBarStyle('light-content', true);
        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(darkTheme.colors.appBackground);
        }
    }

    public updateAppReady = () => {
        this.setState(
            {
                appReady:
                    this.translationsLoaded &&
                    this.reduxStateLoaded &&
                    this.state.splashAnimationDone
            },
            () => {
                if (this.state.appReady && store.getState().wallets.length >= 1) {
                    setTimeout(() => this.requestPassword(), 500);
                }
            }
        );
    };

    public componentDidMount() {
        AppState.addEventListener('change', this.handleAppStateChange);

        setTimeout(
            () => this.setState({ splashAnimationDone: true }, () => this.updateAppReady()),
            1000
        );

        Notification.configure();

        // const date = new Date();
        // date.setSeconds(date.getSeconds() + 10);
        // Notifications.scheduleNotification(date);
    }

    public componentWillUnmount() {
        AppState.removeEventListener('change', this.handleAppStateChange);
    }

    public requestPassword() {
        this.passwordModal.requestPassword().then(() => this.setState({ appState: 'active' }));
    }

    public handleAppStateChange = (nextAppState: string) => {
        if (
            this.state.appState.match(/inactive|background/) &&
            nextAppState === 'active' &&
            store.getState().wallets.length >= 1
        ) {
            this.requestPassword();
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
                            <AppContainer theme="dark" />
                            <PasswordModal obRef={ref => (this.passwordModal = ref)} />
                        </ThemeContext.Provider>
                    </PersistGate>
                </Provider>
            );
        } else {
            return <SplashScreen />;
        }
    }
}
