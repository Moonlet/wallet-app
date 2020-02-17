import { TransactionMessageText, TransactionMessageType } from '../../../../core/blockchain/types';

export interface ISendScreenState {
    message: { text: TransactionMessageText; type: TransactionMessageType };
}
