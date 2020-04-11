import { HintsComponent, HintsScreen } from './state';
import { IReduxState } from '../state';
import { clearPinCode } from '../../core/secure/keychain';

export const SET_ACCEPTED_TC_VERSION = 'SET_ACCEPTED_TC_VERSION';
export const SHOW_HINT = 'SHOW_HINT';
export const RESET_FAILED_LOGINS = 'RESET_FAILED_LOGINS';
export const INCREMENT_FAILED_LOGINS = 'INCREMENT_FAILED_LOGINS';
export const SET_APP_BLOCK_UNTIL = 'SET_APP_BLOCK_UNTIL';
export const RESET_ALL_DATA = 'RESET_ALL_DATA';

export const appSetAcceptedTcVersion = (version: number) => {
    return {
        type: SET_ACCEPTED_TC_VERSION,
        data: version
    };
};

export const updateDisplayedHint = (screen: HintsScreen, component: HintsComponent) => {
    return {
        type: SHOW_HINT,
        data: { screen, component }
    };
};

export const incrementFailedLogins = () => {
    return {
        type: INCREMENT_FAILED_LOGINS
    };
};

export const resetFailedLogins = () => {
    return {
        type: RESET_FAILED_LOGINS
    };
};

export const setAppBlockUntil = (date: Date | string) => {
    return {
        type: SET_APP_BLOCK_UNTIL,
        data: { date }
    };
};

export const resetAllData = () => async (dispatch, getState: () => IReduxState) => {
    clearPinCode(); // clear keychain storage
    dispatch({ type: RESET_ALL_DATA });
};
