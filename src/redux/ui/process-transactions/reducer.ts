import { IProcessTransactionsState } from './state';
import { IAction } from '../../types';
import {
    OPEN_PROCESS_TXS,
    CLOSE_PROCESS_TXS,
    SET_PROCESS_TXS,
    UPDATE_PROCESS_TX_ID,
    UPDATE_PROCESS_TX_STATUS,
    SET_CREATE_ACCOUNT,
    SET_PROCESS_TX_INDEX,
    SET_PROCESS_TX_SIGNING_COMPLETED
} from './actions';

const intialState: IProcessTransactionsState = {
    isVisible: false,
    data: {
        txs: [],
        currentTxIndex: -1,
        signingCompleted: false,
        signingError: false,
        signingInProgress: false,
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
                    signingInProgress: false,
                    signingCompleted: false,
                    signingError: false,
                    currentTxIndex: -1,
                    txs: action.data.txs
                }
            };

        case SET_PROCESS_TX_INDEX:
            return {
                ...state,
                data: {
                    ...state.data,
                    signingInProgress: action.data.index >= 0,
                    currentTxIndex: action.data.index
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
        case SET_PROCESS_TX_SIGNING_COMPLETED:
            return {
                ...state,
                data: {
                    ...state.data,
                    ...action.data
                }
            };

        default:
            break;
    }
    return state;
};
