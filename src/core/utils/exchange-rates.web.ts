import { database } from 'firebase/app';
import 'firebase/database';

export const subscribeExchangeRateValues = (rate: string, callback: any) =>
    database()
        .ref('/exchange-rates')
        .child('values')
        .child(rate)
        .on('value', (snapshot: any) => callback(snapshot));

export const subscribeExchangeRateUpdated = (callback: any) =>
    database()
        .ref('/exchange-rates')
        .child('updated')
        .on('value', (snapshot: any) => callback(snapshot));
