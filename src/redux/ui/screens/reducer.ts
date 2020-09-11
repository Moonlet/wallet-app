import connectHardwareWalletReducer from './connectHardwareWallet/reducer';
import posActionsReducer from './posActions/reducer';
import { combineReducers } from 'redux';

export const screensReducer = combineReducers({
    connectHardwareWallet: connectHardwareWalletReducer,
    posActions: posActionsReducer
});
