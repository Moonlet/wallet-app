import { IBlockchainTransaction } from '../../../core/blockchain/types';
import { TransactionStatus } from '../../../core/wallet/types';
import { IAccountState } from '../../wallets/state';

export const OPEN_PROCESS_TXS = 'OPEN_PROCESS_TXS';
export const CLOSE_PROCESS_TXS = 'CLOSE_PROCESS_TXS';
export const SET_PROCESS_TXS = 'SET_PROCESS_TXS';
export const UPDATE_PROCESS_TX_STATUS = 'UPDATE_PROCESS_TX_STATUS';
export const UPDATE_PROCESS_TX_ID = 'UPDATE_PROCESS_TX_ID';
export const SET_CREATE_ACCOUNT = 'SET_CREATE_ACCOUNT';
export const UPDATE_TRANSACTION_SIGNATURE = 'UPDATE_TRANSACTION_SIGNATURE';

export const openProcessTransactions = () => {
    return {
        type: OPEN_PROCESS_TXS,
        data: {}
    };
};

export const setProcessTransactions = (
    txs: { transaction: IBlockchainTransaction; signature: string }[]
) => {
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

export const updateProcessTransactionSignatureForIndex = (index: number, signature: string) => {
    return {
        type: UPDATE_TRANSACTION_SIGNATURE,
        data: {
            signature,
            index
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
