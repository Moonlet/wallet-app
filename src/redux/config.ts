import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { persistReducer } from 'redux-persist';
import { persistConfig } from './utils/persistConfig';
import walletsReducer from './wallets/reducer';
import appReducer from './app/reducer';
import marketReducer from './market/reducer';
import prefReducer from './preferences/reducer';
import contactsReducer from './contacts/reducer';
import connectHardwareWalletReducer from './screens/connectHardwareWallet/reducer';
import sendReducer from './screens/send/reducer';

const composeEnhancers = composeWithDevTools({
    // options like actionSanitizer, stateSanitizer
});

export const screensReducer = combineReducers({
    connectHardwareWallet: connectHardwareWalletReducer,
    send: sendReducer
});

export const rootReducer = combineReducers({
    app: appReducer,
    wallets: walletsReducer,
    market: marketReducer,
    preferences: prefReducer,
    screens: screensReducer,
    contacts: contactsReducer
});

const configureStore = () => {
    return createStore(
        persistReducer(persistConfig, rootReducer),
        {},
        composeEnhancers(applyMiddleware(thunk))
    );
};

export default configureStore;
