import { IBlockchainTransaction } from '../../../core/blockchain/types';

export const OPEN_PROCESS_TXS = 'OPEN_PROCESS_TXS';
export const CLOSE_PROCESS_TXS = 'CLOSE_PROCESS_TXS';
export const SET_PROCESS_TXS = 'SET_PROCESS_TXS';

export const openProcessTransactions = () => {
    return {
        type: OPEN_PROCESS_TXS,
        data: {}
    };
};

export const setProcessTransactions = (options: { txs: IBlockchainTransaction[] }) => {
    return {
        type: SET_PROCESS_TXS,
        data: {
            txs: options.txs
        }
    };
};

export const updateProcessTransactions = (options: { txs: IBlockchainTransaction[] }) => {
    return {
        type: SET_PROCESS_TXS,
        data: {
            txs: options.txs
        }
    };
};

export const closeProcessTransactions = () => {
    return {
        type: CLOSE_PROCESS_TXS
    };
};
