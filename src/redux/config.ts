import { Platform } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { persistReducer, persistStore } from 'redux-persist';
import { persistConfig } from './utils/persistConfig';
import walletsReducer from './wallets/reducer';
import appReducer from './app/reducer';
import marketReducer from './market/reducer';
import prefReducer from './preferences/reducer';
import contactsReducer from './contacts/reducer';
import notificationsReducer from './notifications/reducer';
import validatorsReducer from './ui/validators/reducer';
import { uiReducer } from './ui/reducer';
import tokensReducer from './tokens/reducer';
import { connectExtensionMiddleware } from './utils/connect-extension-middleware';
// import logger from 'redux-logger';
import { Store, applyMiddleware as applyMiddlewareWebExt } from 'webext-redux';

const composeEnhancers = composeWithDevTools({
    // options like actionSanitizer, stateSanitizer
});

export const rootReducer = combineReducers({
    app: appReducer,
    wallets: walletsReducer,
    tokens: tokensReducer,
    market: marketReducer,
    preferences: prefReducer,
    ui: uiReducer,
    contacts: contactsReducer,
    notifications: notificationsReducer,
    validators: validatorsReducer
});

const configureStore = () => {
    return createStore(
        persistReducer(persistConfig, rootReducer),
        {},
        composeEnhancers(applyMiddleware(thunk, connectExtensionMiddleware)) // logger: for debugging
    );
};

let _store;
let _persistor;
if (Platform.OS === 'web' && process.env.CONTEXT === 'extension-popover') {
    _store = applyMiddlewareWebExt(
        new Store({
            portName: 'moonlet-extension-store-port'
        }),
        thunk
    );
} else {
    _store = configureStore();
    _persistor = persistStore(_store);
}

export const store = _store;

export const persistor = _persistor;
