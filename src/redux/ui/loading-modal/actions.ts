import { TransactionMessageText, TransactionMessageType } from '../../../core/blockchain/types';

export const CLOSE_LOADING_MODAL = 'CLOSE_LOADING_MODAL';
export const OPEN_LOADING_MODAL = 'OPEN_LOADING_MODAL';
export const DISPLAY_MESSAGE = 'DISPLAY_MESSAGE';

export const openLoadingModal = () => {
    return {
        type: OPEN_LOADING_MODAL
    };
};

export const closeLoadingModal = () => {
    return {
        type: CLOSE_LOADING_MODAL
    };
};

export const displayMessage = (value: TransactionMessageText, type: TransactionMessageType) => {
    return {
        type: DISPLAY_MESSAGE,
        data: {
            message: value,
            type
        }
    };
};
