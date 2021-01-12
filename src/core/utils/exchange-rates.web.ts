import { database } from 'firebase/app';
import 'firebase/database';

export const subscribedExchangeRates = {};

export const subscribeExchangeRateValue = (rate: string, callback: (value: number) => void) =>
    database()
        .ref('/exchange-rates')
        .child('values')
        .child(rate)
        .on('value', (value: any) => {
            subscribedExchangeRates[rate] = value;
            return callback(value);
        });
