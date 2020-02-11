import { TransactionMessageText, TransactionMessageType } from '../../../../core/blockchain/types';

// actions consts
export const DISPLAY_MESSAGE = 'DISPLAY_MESSAGE';

export const displayMessage = (value: TransactionMessageText, type: TransactionMessageType) => {
    return {
        type: DISPLAY_MESSAGE,
        data: {
            message: value,
            type
        }
    };
};
