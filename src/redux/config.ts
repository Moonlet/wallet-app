import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import { persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import walletsReducer from './wallets/reducer';
import appReducer from './app/reducer';
import marketReducer from './market/reducer';
import prefReducer from './preferences/reducer';

const composeEnhancers = composeWithDevTools({
    // options like actionSanitizer, stateSanitizer
});

const persistConfig = {
    key: 'root',
    version: 1,
    storage: AsyncStorage,
    whitelist: ['preferences'] // only user and activity information will be persisted
};

const rootReducer = combineReducers({
    app: appReducer,
    wallets: walletsReducer,
    market: marketReducer,
    preferences: prefReducer
});

const configureStore = () =>
    createStore(
        persistReducer(persistConfig, rootReducer),
        {},
        composeEnhancers(applyMiddleware(thunk))
    );

// const persist = persistStore(
//     createStore(
//         persistReducer(persistConfig, rootReducer),
//         {},
//         composeEnhancers(applyMiddleware(thunk))
//     )
// );

export default configureStore;
