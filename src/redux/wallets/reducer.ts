import { IAction } from '../types';
import { IWalletState } from './state';
import { WALLET_ADD } from './actions';

export default (state: IWalletState[] = [], action: IAction) => {
    switch (action.type) {
        case WALLET_ADD:
            return [...state, action.data];
        default:
            break;
    }
    return state;
};
