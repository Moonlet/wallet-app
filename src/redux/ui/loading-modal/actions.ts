import { TransactionMessageText, TransactionMessageType } from '../../../core/blockchain/types';
import { IReduxState } from '../../state';
import { Dispatch } from 'react';
import { IAction } from '../../types';

export const CLOSE_LOADING_MODAL = 'CLOSE_LOADING_MODAL';
export const OPEN_LOADING_MODAL = 'OPEN_LOADING_MODAL';
export const DISPLAY_MESSAGE = 'DISPLAY_MESSAGE';

export const openLoadingModal = () => {
    return {
        type: OPEN_LOADING_MODAL
    };
};

export const closeLoadingModal = () => (
    dispatch: Dispatch<IAction<any>>,
    getState: () => IReduxState
) => {
    dispatch({ type: CLOSE_LOADING_MODAL });
    dispatch({ type: DISPLAY_MESSAGE, data: undefined });
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
