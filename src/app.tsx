import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import { createAppContainer } from 'react-navigation';
import store from './redux/config';
import { RootNavigation } from './navigation/navigation';

import { darkTheme } from './styles/themes/dark-theme';
import { ThemeContext } from './core/theme/theme-contex';
import { loadTranslations } from './core/i18n';

const AppContainer = createAppContainer(RootNavigation);

// const store = configureStore();

interface IState {
    appReady: boolean;
}
export default class App extends React.Component<{}, IState> {
    private translationsLoaded: boolean = false;
    private reduxStateLoaded: boolean = false;

    constructor(props: any) {
        super(props);
        this.state = {
            appReady: false
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

    public render() {
        // decide the bar style on lightTheme
        StatusBar.setBarStyle('light-content', true);
        if (this.state.appReady) {
            return (
                <Provider store={store}>
                    <ThemeContext.Provider value={darkTheme}>
                        <AppContainer theme="dark" />
                    </ThemeContext.Provider>
                </Provider>
            );
        } else {
            return null;
        }
    }
}
