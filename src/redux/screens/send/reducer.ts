import { ISendScreenState } from './state';
import { IAction } from '../../types';
import { REVIEW_TRANSACTION } from './actions';

const intialState: ISendScreenState = {
    reviewTransaction: false
};

export default (state: ISendScreenState = intialState, action: IAction): ISendScreenState => {
    switch (action.type) {
        case REVIEW_TRANSACTION:
            return { ...state, reviewTransaction: action.data };

        default:
            break;
    }
    return state;
};
