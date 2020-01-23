import { IExtensionState } from './state';
import { IAction } from '../../types';
import { STATE_LOADED } from './actions';

const intialState: IExtensionState = {
    stateLoaded: false
};

export default (state: IExtensionState = intialState, action: IAction): IExtensionState => {
    switch (action.type) {
        case STATE_LOADED:
            return {
                ...state,
                stateLoaded: true
            };
        default:
            break;
    }
    return state;
};
