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
import { walletConnectMiddleware } from './utils/wallet-connect-middleware';
import { uiReducer } from './ui/reducer';
import tokensReducer from './tokens/reducer';

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
    contacts: contactsReducer
});

const configureStore = () => {
    return createStore(
        persistReducer(persistConfig, rootReducer),
        {},
        composeEnhancers(applyMiddleware(thunk, walletConnectMiddleware))
    );
};

export const store = configureStore();
