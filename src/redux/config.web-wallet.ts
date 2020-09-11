import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { persistReducer } from 'redux-persist';
import { persistConfig } from './utils/persistConfig';
import appReducer from './app/reducer';
import marketReducer from './market/reducer';
import { uiReducer } from './ui/reducer';
// import logger from 'redux-logger';

const composeEnhancers = composeWithDevTools({
    // options like actionSanitizer, stateSanitizer
});

const dummyReducer = (state = {}): any => state;

export const rootReducer = combineReducers({
    app: appReducer,
    tokens: dummyReducer,
    market: marketReducer,
    ui: uiReducer,
    wallets: dummyReducer,
    contacts: dummyReducer,
    preferences: dummyReducer,
    notifications: dummyReducer
});

const configureStore = () => {
    return createStore(
        persistReducer(persistConfig, rootReducer),
        {},
        composeEnhancers(applyMiddleware(thunk)) // logger: for debugging
    );
};

export const store = configureStore();
