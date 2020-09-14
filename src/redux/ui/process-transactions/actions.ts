import { IBlockchainTransaction } from '../../../core/blockchain/types';
import { TransactionStatus } from '../../../core/wallet/types';

export const OPEN_PROCESS_TXS = 'OPEN_PROCESS_TXS';
export const CLOSE_PROCESS_TXS = 'CLOSE_PROCESS_TXS';
export const SET_PROCESS_TXS = 'SET_PROCESS_TXS';
export const UPDATE_PROCESS_TX_STATUS = 'UPDATE_PROCESS_TX_STATUS';
export const UPDATE_PROCESS_TX_ID = 'UPDATE_PROCESS_TX_ID';

export const openProcessTransactions = () => {
    return {
        type: OPEN_PROCESS_TXS,
        data: {}
    };
};

export const setProcessTransactions = (txs: IBlockchainTransaction[], tokenSymbol: string) => {
    return {
        type: SET_PROCESS_TXS,
        data: {
            tokenSymbol,
            txs
        }
    };
};

export const updateProcessTransactionStatusForIndex = (
    index: number,
    status: TransactionStatus
) => {
    return {
        type: UPDATE_PROCESS_TX_STATUS,
        data: {
            index,
            status
        }
    };
};

export const updateProcessTransactionIdForIndex = (index: number, id: string) => {
    return {
        type: UPDATE_PROCESS_TX_ID,
        data: {
            index,
            id
        }
    };
};

export const closeProcessTransactions = () => {
    return {
        type: CLOSE_PROCESS_TXS
    };
};
