export const CLOSE_TX_REQUEST = 'CLOSE_TX_REQUEST';
export const OPEN_TX_REQUEST = 'OPEN_TX_REQUEST';

export const openTransactionRequest = (options: { requestId?: string; qrCode?: string }) => {
    return {
        type: OPEN_TX_REQUEST,
        data: {
            requestId: options?.requestId,
            qrCode: options?.qrCode
        }
    };
};

export const closeTransactionRequest = () => {
    return {
        type: CLOSE_TX_REQUEST
    };
};
