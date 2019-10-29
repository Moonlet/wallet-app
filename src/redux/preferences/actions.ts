// actions consts
export const PREF_SET_CURRENCY = 'PREF_SET_CURRENCY';
export const PREF_SET_PIN = 'PREF_SET_PIN';

// import { IAction } from '../types';

// actions creators

export function setPinLogin() {
    return {
        type: PREF_SET_PIN
    };
}
