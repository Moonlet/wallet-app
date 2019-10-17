import React from 'react';
import { Provider } from 'react-redux';
import { createAppContainer } from 'react-navigation';
import configureStore from './redux/config';
import { RootNavigation } from './navigation/navigation';

import { darkTheme } from './styles/themes/dark-theme';
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
