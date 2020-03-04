import { IAppState } from './state';
import { IAction } from '../types';
import { SET_ACCEPTED_TC_VERSION } from './actions';

const intialState: IAppState = {
    version: 1,
    tcAcceptedVersion: undefined
};

export default (state: IAppState = intialState, action: IAction): IAppState => {
    switch (action.type) {
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
