import React, { ReactNode } from 'react';
import { NativeModules } from 'react-native';
import { Provider } from 'react-redux';
import { createAppContainer } from 'react-navigation';
import configureStore from './redux/config';
import { RootNavigation } from './navigation';
import { AppContext } from './app-context';
import { Icon } from './components/icon';

const AppContainer = createAppContainer(RootNavigation);

const store = configureStore();

const App = () => {
    return (
        <Provider store={store}>
            <AppContext.Provider value={{}}>
                <AppContainer />
            </AppContext.Provider>
        </Provider>
    );
};

export default App;
