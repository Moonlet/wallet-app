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
    3: 1 * 30 * 1000, // 5 min
    6: 1 * 35 * 1000, // 20 min
    9: 1 * 40 * 1000, // 1h
    12: 24 * 60 * 60 * 1000 // 1 day
};
