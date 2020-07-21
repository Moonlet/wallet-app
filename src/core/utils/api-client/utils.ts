import CONFIG from '../../../config';
import * as schnorr from '@zilliqa-js/crypto/dist/schnorr';
import ntpClient from 'react-native-ntp-client';

export const getCurrentTimestampNTP = () => {
    return new Promise((resolve, reject) => {
        ntpClient.getNetworkTime(CONFIG.ntpServer, CONFIG.ntpPort, (error: any, date: any) => {
            if (error) {
                // should retry
                return reject(error);
            } else {
                return resolve(new Date(date).getTime());
            }
        });
    });
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
