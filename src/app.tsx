import React, { ReactNode } from 'react';
import { NativeModules } from 'react-native';
import { Provider } from 'react-redux';
import { createAppContainer } from 'react-navigation';
import configureStore from './redux/config';
import { RootNavigation } from './navigation';

const AppContainer = createAppContainer(RootNavigation);

const store = configureStore();

// dummy commit 3

const App = () => {
    return (
        <Provider store={store}>
            <AppContainer />
        </Provider>
    );
};

export default App;
