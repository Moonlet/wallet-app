import React from 'react';
import { Provider } from 'react-redux';
import { store } from './redux/config';
import { darkTheme } from './styles/themes/dark-theme';
import { ThemeContext } from './core/theme/theme-contex';
import { loadTranslations } from './core/i18n';
import { SplashScreen } from './components/splash-screen/splash-screen';
import { getRemoteConfigFeatures } from './core/utils/remote-feature-config';
import { subscribeExchangeRates } from './core/utils/exchange-rates';
import { updateExchangeRates } from './redux/market/actions';
import { IExchangeRates } from './redux/market/state';
import DeviceInfo from 'react-native-device-info';
import { setDeviceId } from './redux/preferences/actions';
import { WebWalletNavigation } from './navigation/navigation.web-wallet';
import { createAppContainer } from 'react-navigation';

const AppContainer = createAppContainer(WebWalletNavigation);

interface IState {
    appReady: boolean;
    splashAnimationDone: boolean;
    displayApplication: boolean;
    navigationState: any;
}

export default class App extends React.Component<{}, IState> {
    public interval: any = null;
    private translationsLoaded: boolean = false;
    private remoteFeatureConfigLoaded: boolean = false;

    constructor(props: any) {
        super(props);
        this.state = {
            appReady: false,
            splashAnimationDone: false,
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
    }

    public updateAppReady = () => {
        const appReady =
            this.translationsLoaded &&
            this.state.splashAnimationDone &&
            this.remoteFeatureConfigLoaded;

        this.setState({ appReady });
    };

    public componentDidMount() {
        store.dispatch(setDeviceId(DeviceInfo.getUniqueId()));

        setTimeout(
            () => this.setState({ splashAnimationDone: true }, () => this.updateAppReady()),
            1000
        );

        subscribeExchangeRates((exchangeRates: IExchangeRates) => {
            if (exchangeRates) {
                store.dispatch(updateExchangeRates(exchangeRates));
            }
        });
    }

    public render() {
        if (this.state.appReady) {
            return (
                <Provider store={store}>
                    <ThemeContext.Provider value={darkTheme}>
                        <AppContainer theme="dark" />
                    </ThemeContext.Provider>
                </Provider>
            );
        } else {
            return (
                <>
                    <SplashScreen />
                </>
            );
        }
    }
}
