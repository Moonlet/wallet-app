export interface ITransactionRequestState {
    isVisible: boolean;
    data: {
        requestId?: string;
        qrCode?: string;
    };
}
