import React from 'react';
import { NativeModules } from 'react-native';
import { Provider } from 'react-redux';
import { createAppContainer } from 'react-navigation';
import configureStore from './redux/config';
import { RootNavigation } from './navigation';
import { darkTheme } from './core/theme/theme-dark';
import { ThemeContext } from './core/theme/theme-contex';

const AppContainer = createAppContainer(RootNavigation);

const store = configureStore();

const App = () => {
    return (
        <Provider store={store}>
            <ThemeContext.Provider value={darkTheme}>
                <AppContainer />
            </ThemeContext.Provider>
        </Provider>
    );
};

export default App;
