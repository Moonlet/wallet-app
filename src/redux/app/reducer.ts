import { IAppState } from './state';
import { IAction } from '../types';
import { APP_SWITCH_WALLET } from './actions';

const intialState: IAppState = {
    currentWalletIndex: 0
};

export default (state: IAppState = intialState, action: IAction): IAppState => {
    switch (action.type) {
        case APP_SWITCH_WALLET:
            return { ...state, currentWalletIndex: action.data };
            break;
        default:
            break;
    }
    return state;
};
