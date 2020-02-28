import { IAppState } from './state';
import { IAction } from '../types';
import { APP_SET_TC_VERSION } from './actions';

const intialState: IAppState = {
    version: 1,
    tcVersion: 0
};

export default (state: IAppState = intialState, action: IAction): IAppState => {
    switch (action.type) {
        case APP_SET_TC_VERSION:
            return { ...state, tcVersion: action.data };

        default:
            break;
    }
    return state;
};
