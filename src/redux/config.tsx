import { createStore, combineReducers } from 'redux';
import walletReducer from './reducers/wallet';

const rootReducer = combineReducers({ wallet: walletReducer });

const configureStore = () => {
  return createStore(rootReducer);
};

export default configureStore;
