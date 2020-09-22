import posActionsReducer from './posActions/reducer';
import { combineReducers } from 'redux';

export const screensReducer = combineReducers({
    posActions: posActionsReducer
});
