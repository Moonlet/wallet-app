import { IProcessTransactionsState } from './state';
import { IAction } from '../../types';
import { OPEN_PROCESS_TXS, CLOSE_PROCESS_TXS, SET_PROCESS_TXS } from './actions';

const intialState: IProcessTransactionsState = {
    isVisible: false,
    data: {
        txs: []
    }
};

export default (
    state: IProcessTransactionsState = intialState,
    action: IAction
): IProcessTransactionsState => {
    switch (action.type) {
        case OPEN_PROCESS_TXS:
            return {
                ...state,
                isVisible: true
            };
        case SET_PROCESS_TXS:
            return {
                ...state,
                data: {
                    txs: action.data.txs
                }
            };

        case CLOSE_PROCESS_TXS:
            return intialState;

        default:
            break;
    }
    return state;
};
