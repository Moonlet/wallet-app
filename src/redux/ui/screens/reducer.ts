import connectHardwareWalletReducer from './connectHardwareWallet/reducer';
import sendReducer from './send/reducer';
import { combineReducers } from 'redux';

export const screensReducer = combineReducers({
    connectHardwareWallet: connectHardwareWalletReducer,
    send: sendReducer
});
