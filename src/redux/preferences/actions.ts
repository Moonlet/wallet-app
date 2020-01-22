import { Dispatch } from 'react';
import { IReduxState } from '../state';
import { getCurrentAccount } from '../wallets/selectors';
import { getBalance } from '../wallets/actions';

// actions consts
export const PREF_SET_CURRENCY = 'PREF_SET_CURRENCY';
export const TOGGLE_PIN_LOGIN = 'TOGGLE_PIN_LOGIN';
export const TOGGLE_TOUCH_ID = 'TOGGLE_TOUCH_ID';
export const SET_TEST_NET = 'SET_TEST_NET';

// actions creators

export const toggleTestNet = () => (dispatch: Dispatch<any>, getState: () => IReduxState) => {
    const state = getState();
    const currentAccount = getCurrentAccount(state);

    dispatch({
        type: SET_TEST_NET
    });
    getBalance(
        currentAccount.blockchain,
        currentAccount.address,
        undefined,
        true
    )(dispatch, getState);
};

export function togglePinLogin() {
    return {
        type: TOGGLE_PIN_LOGIN
    };
}

export function toggleTouchID() {
    return {
        type: TOGGLE_TOUCH_ID
    };
}

export function setCurrency(currency: string) {
    return {
        type: PREF_SET_CURRENCY,
        data: { currency }
    };
}
