import { TransactionMessageText, TransactionMessageType } from '../../../core/blockchain/types';

export interface ILoadingModalMessage {
    type: TransactionMessageType;
    text?: TransactionMessageText;
    component?: React.ComponentType;
}

export interface ILoadingModalState {
    isVisible: boolean;
    message: ILoadingModalMessage;
}
