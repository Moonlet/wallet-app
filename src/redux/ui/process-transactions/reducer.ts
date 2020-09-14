import { IProcessTransactionsState } from './state';
import { IAction } from '../../types';
import {
    OPEN_PROCESS_TXS,
    CLOSE_PROCESS_TXS,
    SET_PROCESS_TXS,
    UPDATE_PROCESS_TX_ID,
    UPDATE_PROCESS_TX_STATUS
} from './actions';

const intialState: IProcessTransactionsState = {
    isVisible: false,
    data: {
        txs: [],
        tokenSymbol: undefined
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
        case UPDATE_PROCESS_TX_STATUS: {
            const txs = [...state.data.txs];
            const tx = txs[action.data.index];
            tx.status = action.data.status;
            txs[action.data.index] = tx;
            return {
                ...state,
                data: {
                    tokenSymbol: state.data.tokenSymbol,
                    txs
                }
            };
        }
        case UPDATE_PROCESS_TX_ID: {
            const txs = [...state.data.txs];
            const tx = txs[action.data.index];
            tx.id = action.data.id;
            txs[action.data.index] = tx;
            return {
                ...state,
                data: {
                    tokenSymbol: state.data.tokenSymbol,
                    txs
                }
            };
        }
        case SET_PROCESS_TXS:
            return {
                ...state,
                data: {
                    tokenSymbol: action.data.tokenSymbol,
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
