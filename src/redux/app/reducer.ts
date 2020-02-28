import { IAppState } from './state';
import { IAction } from '../types';
import { SET_TC_VERSION, SET_ACCEPTED_TC_VERSION } from './actions';

const intialState: IAppState = {
    version: 1,
    tcVersion: 0,
    tcAcceptedVersion: undefined
};

export default (state: IAppState = intialState, action: IAction): IAppState => {
    switch (action.type) {
        case SET_TC_VERSION:
            return {
                ...state,
                tcVersion: action.data
            };

        case SET_ACCEPTED_TC_VERSION:
            return {
                ...state,
                tcAcceptedVersion: action.data
            };

        default:
            break;
    }
    return state;
};
