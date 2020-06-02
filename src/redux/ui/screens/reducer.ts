import connectHardwareWalletReducer from './connectHardwareWallet/reducer';
import dashboardReducer from './dashboard/reducer';
import posActionsReducer from './posActions/reducer';
import { combineReducers } from 'redux';

export const screensReducer = combineReducers({
    connectHardwareWallet: connectHardwareWalletReducer,
    dashboard: dashboardReducer,
    posActions: posActionsReducer
});
