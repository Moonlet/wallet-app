import connectHardwareWalletReducer from './connectHardwareWallet/reducer';
import dashboardReducer from './dashboard/reducer';
import { combineReducers } from 'redux';

export const screensReducer = combineReducers({
    connectHardwareWallet: connectHardwareWalletReducer,
    dashboard: dashboardReducer
});
