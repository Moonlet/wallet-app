import { database } from 'firebase/app';
import 'firebase/database';

export const subscribeExchangeRate = (rate: string, callback: any) =>
    database()
        .ref('/exchange-rates')
        .child('values')
        .child(rate)
        .on('value', (snapshot: any) => callback(snapshot));
