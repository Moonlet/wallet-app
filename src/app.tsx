import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import { createAppContainer } from 'react-navigation';
import { RootNavigation } from './navigation/navigation';
import configureStore from './redux/config';
import { PersistGate } from 'redux-persist/integration/react';
import { darkTheme } from './styles/themes/dark-theme';
import { ThemeContext } from './core/theme/theme-contex';
import { loadTranslations } from './core/i18n';
import { persistStore } from 'redux-persist';
import { SplashScreen } from './components/splash-screen/SplashScreen';

const AppContainer = createAppContainer(RootNavigation);

const store = configureStore();
const persistor = persistStore(store);
const MIN_TIME_ANIMATION = 2;

interface IState {
    appReady: boolean;
    defaultTimer: any;
}

export default class App extends React.Component<{}, IState> {
    public interval: any = null;
    //    public unsubscribe =
    private translationsLoaded: boolean = false;
    private reduxStateLoaded: boolean = false;

    constructor(props: any) {
        super(props);
        this.state = {
            appReady: false,
            defaultTimer: 1
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
    }

    public updateAppReady() {
        this.setState({ appReady: this.translationsLoaded && this.reduxStateLoaded });
    }

    public componentDidMount() {
        this.interval = setInterval(
            () => this.setState({ defaultTimer: this.state.defaultTimer + 1 }),
            1000
        );
    }

    public componentDidUpdate() {
        if (this.state.defaultTimer === MIN_TIME_ANIMATION) {
            clearInterval(this.interval);
        }
    }

    public componentWillUnmount() {
        clearInterval(this.interval);
    }

    public render() {
        // decide the bar style on lightTheme
        StatusBar.setBarStyle('light-content', true);

        if (this.state.appReady && this.state.defaultTimer === MIN_TIME_ANIMATION) {
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
