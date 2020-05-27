import { ITransactionRequestState } from './state';
import { IAction } from '../../types';
import { OPEN_TX_REQUEST, CLOSE_TX_REQUEST } from './actions';

const intialState: ITransactionRequestState = {
    isVisible: false,
    data: {
        requestId: undefined,
        qrCode: undefined
    }
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
                data: {
                    requestId: action.data?.requestId,
                    qrCode: action.data?.qrCode
                }
            };

        case CLOSE_TX_REQUEST:
            return intialState;

        default:
            break;
    }
    return state;
};
