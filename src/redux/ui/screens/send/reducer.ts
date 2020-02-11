import { ISendScreenState } from './state';
import { IAction } from '../../../types';
import { DISPLAY_MESSAGE } from './actions';

const intialState: ISendScreenState = {
    message: undefined
};

export default (state: ISendScreenState = intialState, action: IAction): ISendScreenState => {
    switch (action.type) {
        case DISPLAY_MESSAGE:
            return { ...state, message: action.data };

        default:
            break;
    }
    return state;
};
