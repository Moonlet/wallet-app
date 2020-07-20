import moment from 'moment';
import CONFIG from '../../../config';
import * as schnorr from '@zilliqa-js/crypto/dist/schnorr';

// Refactor this using ntp time
export const getTimestamp = () => {
    return moment().unix() * 1000;
};

export const getDomain = () => {
    return new URL(CONFIG.walletApiBaseUrl).host;
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
