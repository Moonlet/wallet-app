import React, { ReactNode } from 'react';
import { NativeModules } from 'react-native';
import { Provider } from 'react-redux';
import { createAppContainer } from 'react-navigation';
import configureStore from './redux/config';
import { AppContext } from './app-context';
import { RootNavigation } from './navigation/navigation';
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
