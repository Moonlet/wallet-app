import { IProcessTransactionsState } from './state';
import { IAction } from '../../types';
import {
    OPEN_PROCESS_TXS,
    CLOSE_PROCESS_TXS,
    SET_PROCESS_TXS,
    UPDATE_PROCESS_TX_ID,
    UPDATE_PROCESS_TX_STATUS,
    SET_CREATE_ACCOUNT
} from './actions';

const intialState: IProcessTransactionsState = {
    isVisible: false,
    data: {
        txs: [],
        createAccount: undefined
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
                    ...state.data,
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
                    ...state.data,
                    txs
                }
            };
        }
        case SET_PROCESS_TXS:
            return {
                ...state,
                data: {
                    ...state.data,
                    txs: action.data.txs
                }
            };

        case CLOSE_PROCESS_TXS:
            return intialState;

        case SET_CREATE_ACCOUNT:
            return {
                ...state,
                data: {
                    ...state.data,
                    createAccount: action.data.account
                }
            };

        default:
            break;
    }
    return state;
};
