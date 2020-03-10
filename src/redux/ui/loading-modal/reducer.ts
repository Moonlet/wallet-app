import { ILoadingModalState } from './state';
import { IAction } from '../../types';
import { OPEN_LOADING_MODAL, CLOSE_LOADING_MODAL, DISPLAY_MESSAGE } from './actions';

const intialState: ILoadingModalState = {
    isVisible: false,
    message: undefined
};

export default (state: ILoadingModalState = intialState, action: IAction): ILoadingModalState => {
    switch (action.type) {
        case OPEN_LOADING_MODAL:
            return {
                ...state,
                isVisible: true
            };

        case CLOSE_LOADING_MODAL:
            return intialState;

        case DISPLAY_MESSAGE:
            return {
                ...state,
                message: action.data
            };

        default:
            break;
    }
    return state;
};
