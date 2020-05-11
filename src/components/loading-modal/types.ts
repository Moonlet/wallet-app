import { TransactionMessageType, TransactionMessageText } from '../../core/blockchain/types';

export interface ILoadingModalMessage {
    type: TransactionMessageType;
    text?: TransactionMessageText;
    component?: any; // React.ComponentType<any>;
}

export interface ILoadingModalState {
    isVisible: boolean;
    message: ILoadingModalMessage;
}
