import { IPrefState } from './state';
import { IAction } from '../types';
import { PREF_SET_PIN } from './actions';

const initialState: IPrefState = {
    currency: 'USD',
    pinLogin: true
};

export default (state: IPrefState = initialState, action: IAction): IPrefState => {
    const newState = { ...state };
    switch (action.type) {
        case PREF_SET_PIN:
            newState.pinLogin = !state.pinLogin;
            break;
        default:
            break;
    }
    return newState;
};
