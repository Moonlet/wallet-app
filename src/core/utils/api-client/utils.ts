import CONFIG from '../../../config';
import * as schnorr from '@zilliqa-js/crypto/dist/schnorr';

export const getCurrentTimestamp = () => {
    return new Date().getTime();
};

export const getWalletApiDomain = () => {
    return CONFIG.walletApiBaseUrl.replace(/^http(s?):\/\//i, '');
};

export const getSignature = (
    data: any,
    walletPrivateKey: string,
    walletPublicKey: string
): string => {
    const sig = schnorr.sign(
        Buffer.from(JSON.stringify(data), 'hex'),
        Buffer.from(walletPrivateKey, 'hex'),
        Buffer.from(walletPublicKey, 'hex')
    );

    return sig.r.toString('hex') + sig.s.toString('hex');
};

export const removeDuplicateObjectsFromArray = (arr: any[]) =>
    arr.filter((v, i, a) => a.findIndex(t => JSON.stringify(t) === JSON.stringify(v)) === i);
