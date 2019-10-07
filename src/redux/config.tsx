import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import walletReducer from './reducers/wallet';
import marketReducer from './reducers/market';

const rootReducer = combineReducers({
    wallet: walletReducer,
    market: marketReducer
});

const configureStore = () => {
    return createStore(rootReducer, applyMiddleware(thunk));
};

export default configureStore;
