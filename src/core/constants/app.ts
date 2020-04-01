export const AVAILABLE_CURRENCIES = ['USD', 'EUR', 'JPY', 'SGD', 'CNY', 'USDT', 'DAI'];
export const WC_CONNECTION = 'wcConnection';
export const WC = {
    GET_STATE: 'moonletGetState',
    SIGN_TRANSACTION: 'moonletSignTransaction',
    UPDATE_STATE: 'moonletUpdateState',
    PING: 'moonletPing'
};
export const DISPLAY_HINTS_TIMES = 3;
export const RESET_APP_FAILED_LOGINS = 15;
export const FAILED_LOGIN_BLOCKING = {
    3: 5 * 60 * 1000, // 5 min
    6: 20 * 60 * 1000, // 20 min
    9: 60 * 60 * 1000, // 1h
    12: 24 * 60 * 60 * 1000 // 1 day
};
