import React, { ReactNode } from 'react';
import { NativeModules } from 'react-native';
import { Provider } from 'react-redux';
import { createAppContainer } from 'react-navigation';
import configureStore from './redux/config';
import { RootNavigation } from './navigation';

const AppContainer = createAppContainer(RootNavigation);

const store = configureStore();

const App = () => {
    // NativeModules.HdWallet.generateWallet().then(response => {
    //     // console.log('resolve response', response);
    // });

    // NativeModules.HdWallet.loadWallets(['menmonic 1', 'mnemonic 2']).then(response => {
    //     // console.log('resolve', response);
    // });
    // NativeModules.HdWallet.getAccounts(1, 'eth', [1, 2, 3]).then(response => {
    //     // console.log('resolve', response);
    // });

    return (
        <Provider store={store}>
            <AppContainer />
        </Provider>
    );
};

export default App;
