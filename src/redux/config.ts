import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import walletsReducer from './wallets/reducer';
import appReducer from './app/reducer';
import marketReducer from './market/reducer';

const rootReducer = combineReducers({
    app: appReducer,
    wallets: walletsReducer,
    market: marketReducer
});

const configureStore = () => {
    return createStore(rootReducer, applyMiddleware(thunk));
};

export default configureStore;
