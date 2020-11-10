import posActionsReducer from './posActions/reducer';
import dataReducer from './data/reducer';
import inputDataReducer from './input-data/reducer';
import { combineReducers } from 'redux';

export const screensReducer = combineReducers({
    posActions: posActionsReducer,
    data: dataReducer,
    inputData: inputDataReducer
});
