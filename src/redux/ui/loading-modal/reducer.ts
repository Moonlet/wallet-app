import { ILoadingModalState } from './state';
import { IAction } from '../../types';
import { OPEN_LOADING_MODAL, CLOSE_LOADING_MODAL } from './actions';

const intialState: ILoadingModalState = {
    isVisible: false
};

export default (state: ILoadingModalState = intialState, action: IAction): ILoadingModalState => {
    switch (action.type) {
        case OPEN_LOADING_MODAL:
            return {
                isVisible: true
            };
        case CLOSE_LOADING_MODAL:
            return intialState;
        default:
            break;
    }
    return state;
};
