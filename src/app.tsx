import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar, Platform } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { RootNavigation } from './navigation/navigation';
import configureStore from './redux/config';
import { PersistGate } from 'redux-persist/integration/react';
import { darkTheme } from './styles/themes/dark-theme';
import { ThemeContext } from './core/theme/theme-contex';
import { loadTranslations } from './core/i18n';
import { persistStore } from 'redux-persist';
import { SplashScreen } from './components/splash-screen/splash-screen';
import { Notifications } from './core/messaging/notifications/notifications';
import { setupVoipNotification } from './core/messaging/silent/ios-voip-push-notification';

const AppContainer = createAppContainer(RootNavigation);

const store = configureStore();
const persistor = persistStore(store);

interface IState {
    appReady: boolean;
    splashAnimationDone: boolean;
}

export default class App extends React.Component<{}, IState> {
    public interval: any = null;
    private translationsLoaded: boolean = false;
    private reduxStateLoaded: boolean = false;

    constructor(props: any) {
        super(props);
        this.state = {
            appReady: false,
            splashAnimationDone: false
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

    public updateAppReady() {
        this.setState({ appReady: this.translationsLoaded && this.reduxStateLoaded });
    }

    public componentDidMount() {
        setTimeout(() => {
            this.setState({ splashAnimationDone: true });
        }, 1000);

        Notifications.configure();

        if (Platform.OS === 'ios') {
            setupVoipNotification();
        }

        // const date = new Date()
        // date.setSeconds(date.getSeconds() + 10)
        // Notifications.scheduleNotification(date)
    }

    public render() {
        if (this.state.appReady && this.state.splashAnimationDone) {
            //            this.unsubscribe();
            return (
                <Provider store={store}>
                    <PersistGate loading={null} persistor={persistor}>
                        <ThemeContext.Provider value={darkTheme}>
                            <AppContainer theme="dark" />
                        </ThemeContext.Provider>
                    </PersistGate>
                </Provider>
            );
        } else {
            return <SplashScreen />;
        }
    }
}
