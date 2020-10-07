import { Blockchain } from '../blockchain/types';
import { getBlockchain } from '../blockchain/blockchain-factory';

const stripAddress = (text: string) => {
    if (text.length === 0) {
        return '';
    }
    let convertedStr = '';
    convertedStr += text.substring(0, 5);
    convertedStr += '.'.repeat(3);
    convertedStr += text.substring(text.length - 5, text.length);
    return convertedStr;
};

export const formatAddress = (text: string, blockchain: Blockchain) => {
    if (!text) return '';

    const split = text.split('.');
    if (split.length > 1 && split[0].length > 20) {
        split[0] = stripAddress(split[0]);
        return split.join('.');
    }

    if (text.match(/.+\.[a-zA-Z]{2,}$/gi)) return text;

    switch (getBlockchain(blockchain).config.ui.addressDisplay) {
        case 'stripped':
            return stripAddress(text);
        default:
            return text;
    }
};

export const fixEthAddress = (address: string): string => {
    if (address.indexOf('0x') < 0) {
        address = '0x' + address;
    }
    return address;
};
