import BigNumber from 'bignumber.js';

export const toHex = value => {
    if (value && value !== '0x') {
        const base = typeof value === 'string' && value.indexOf('0x') === 0 ? 16 : 10;

        let stringValue = new BigNumber(value, base).toString(16);
        if (stringValue.length % 2 > 0) {
            stringValue = '0' + stringValue;
        }
        return '0x' + stringValue;
    }
    return '0x';
};

export const trimLeadingZero = (hex: string) => {
    while (hex && hex.startsWith('0x0')) {
        hex = '0x' + hex.slice(3);
    }
    return hex;
};

export const makeEven = (hex: string) => {
    if (hex.length % 2 === 1) {
        hex = hex.replace('0x', '0x0');
    }
    return hex;
};
