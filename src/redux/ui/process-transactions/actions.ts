import { IBlockchainTransaction } from '../../../core/blockchain/types';
import { TransactionStatus } from '../../../core/wallet/types';
import { IAccountState } from '../../wallets/state';

export const OPEN_PROCESS_TXS = 'OPEN_PROCESS_TXS';
export const CLOSE_PROCESS_TXS = 'CLOSE_PROCESS_TXS';
export const SET_PROCESS_TXS = 'SET_PROCESS_TXS';
export const SET_PROCESS_TX_INDEX = 'SET_PROCESS_TX_INDEX';
export const UPDATE_PROCESS_TX_STATUS = 'UPDATE_PROCESS_TX_STATUS';
export const UPDATE_PROCESS_TX_ID = 'UPDATE_PROCESS_TX_ID';
export const SET_CREATE_ACCOUNT = 'SET_CREATE_ACCOUNT';
export const SET_PROCESS_TX_SIGNING_COMPLETED = 'SET_PROCESS_TX_SIGNING_COMPLETED';
export const UPDATE_PROCESS_TX_CONFIRMATIONS = 'UPDATE_PROCESS_TX_CONFIRMATIONS';

export const openProcessTransactions = () => {
    return {
        type: OPEN_PROCESS_TXS,
        data: {}
    };
};

export const setProcessTransactions = (txs: IBlockchainTransaction[]) => {
    return {
        type: SET_PROCESS_TXS,
        data: {
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

export const updateProcessTransactionConfirmationsForIndex = (
    index: number,
    confirmations: number
) => {
    return {
        type: UPDATE_PROCESS_TX_CONFIRMATIONS,
        data: {
            index,
            confirmations
        }
    };
};

export const closeProcessTransactions = () => {
    return {
        type: CLOSE_PROCESS_TXS
    };
};

export const setProcessTxCreateAccount = (account: IAccountState) => {
    return {
        type: SET_CREATE_ACCOUNT,
        data: {
            account
        }
    };
};

export const setProcessTxIndex = (index: number) => {
    return {
        type: SET_PROCESS_TX_INDEX,
        data: {
            index
        }
    };
};

export const setProcessTxCompleted = (signingCompleted: boolean, signingError: boolean = false) => {
    return {
        type: SET_PROCESS_TX_SIGNING_COMPLETED,
        data: {
            signingInProgress: !signingCompleted,
            signingCompleted,
            signingError
        }
    };
};
