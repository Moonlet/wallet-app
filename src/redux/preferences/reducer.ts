import { IPrefState } from './state';
import { IAction } from '../types';
import { PREF_SET_PIN, PREF_SET_CURRENCY } from './actions';

const initialState: IPrefState = {
    currency: 'USD',
    pinLogin: true
};

export default (state: IPrefState = initialState, action: IAction): IPrefState => {
    switch (action.type) {
        case PREF_SET_PIN:
            state = { ...state }; // use this for each case and avoid setting it as general
            state.pinLogin = !state.pinLogin;
            break;
        case PREF_SET_CURRENCY:
            return {
                ...state,
                currency: action.data.currency
            };
        default:
            break;
    }
    return state;
};
