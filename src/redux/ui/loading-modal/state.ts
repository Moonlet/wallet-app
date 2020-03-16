import { TransactionMessageText, TransactionMessageType } from '../../../core/blockchain/types';

export interface ILoadingModalMessage {
    text: TransactionMessageText;
    type: TransactionMessageType;
}

export interface ILoadingModalState {
    isVisible: boolean;
    message: ILoadingModalMessage;
}
