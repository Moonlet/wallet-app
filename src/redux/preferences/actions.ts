// actions consts
export const PREF_SET_CURRENCY = 'PREF_SET_CURRENCY';
export const TOGGLE_PIN_LOGIN = 'TOGGLE_PIN_LOGIN';
export const TOGGLE_TOUCH_ID = 'TOGGLE_TOUCH_ID';

// actions creators

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
