import { IAppState } from './state';
import { IAction } from '../types';

const intialState: IAppState = {
    currency: 'USD'
};

export default (state: IAppState = intialState, action: IAction): IAppState => {
    return state;
};
