import { IAppState } from './state';
import { IAction } from '../types';

const intialState: IAppState = {
    currentWalletIndex: 0
};

export default (state: IAppState = intialState, action: IAction): IAppState => {
    return state;
};
