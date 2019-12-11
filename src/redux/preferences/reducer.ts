import { IPrefState } from './state';
import { IAction } from '../types';
import { TOGGLE_PIN_LOGIN, PREF_SET_CURRENCY, TOGGLE_TOUCH_ID } from './actions';

const initialState: IPrefState = {
    currency: 'USD',
    pinLogin: true,
    touchID: false
};

export default (state: IPrefState = initialState, action: IAction): IPrefState => {
    switch (action.type) {
        case TOGGLE_PIN_LOGIN:
            state = { ...state }; // use this for each case and avoid setting it as general
            state.pinLogin = !state.pinLogin;
            break;
        case TOGGLE_TOUCH_ID:
            state = { ...state };
            state.touchID = !state.touchID;
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
