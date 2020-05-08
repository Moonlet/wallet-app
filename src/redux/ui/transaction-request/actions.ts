export const CLOSE_TX_REQUEST = 'CLOSE_TX_REQUEST';
export const OPEN_TX_REQUEST = 'OPEN_TX_REQUEST';

export const openTransactionRequest = (requestId: string) => {
    return {
        type: OPEN_TX_REQUEST,
        data: { requestId }
    };
};

export const closeTransactionRequest = () => {
    return {
        type: CLOSE_TX_REQUEST
    };
};
