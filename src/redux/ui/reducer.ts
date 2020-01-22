import { combineReducers } from 'redux';
import { screensReducer } from './screens/reducer';
import extensionReducer from './extension/reducer';
import bottomSheetReducer from './bottomSheet/reducer';

export const uiReducer = combineReducers({
    screens: screensReducer,
    extension: extensionReducer,
    bottomSheet: bottomSheetReducer
});
