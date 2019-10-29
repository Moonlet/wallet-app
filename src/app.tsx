import React from 'react';
import { Provider } from 'react-redux';
import { StatusBar } from 'react-native';
import { createAppContainer } from 'react-navigation';
import configureStore from './redux/config';
import { RootNavigation } from './navigation/navigation';

import { darkTheme } from './styles/themes/dark-theme';
import { ThemeContext } from './core/theme/theme-contex';
import { loadTranslations } from './core/i18n';

const AppContainer = createAppContainer(RootNavigation);

const store = configureStore();

interface IState {
    appReady: boolean;
    translationsLoaded: boolean;
    reduxStateLoaded: boolean;
}
export default class App extends React.Component<{}, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            appReady: false,
            translationsLoaded: false,
            reduxStateLoaded: true
        };

        loadTranslations('en').then(() => {
            this.setAppState({ translationsLoaded: true });
        });
    }

    public setAppState<K extends keyof IState>(state: Pick<IState, K>) {
        const newState = {
            ...this.state,
            ...state
        };

        if (newState.translationsLoaded && newState.reduxStateLoaded) {
            this.setState({ ...state, appReady: true });
        }
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
