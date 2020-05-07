import { ITransactionRequestState } from './state';
import { IAction } from '../../types';
import { OPEN_TX_REQUEST, CLOSE_TX_REQUEST } from './actions';

const intialState: ITransactionRequestState = {
    isVisible: false,
    requestId: undefined
};

export default (
    state: ITransactionRequestState = intialState,
    action: IAction
): ITransactionRequestState => {
    switch (action.type) {
        case OPEN_TX_REQUEST:
            return {
                ...state,
                isVisible: true,
                requestId: action.data.requestId
            };

        case CLOSE_TX_REQUEST:
            return intialState;

        default:
            break;
    }
    return state;
};
