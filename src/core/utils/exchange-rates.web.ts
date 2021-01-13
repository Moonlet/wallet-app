import { database } from 'firebase/app';
import 'firebase/database';

export const subscribedExchangeRates = {};

export const subscribeExchangeRateValue = (rate: string): Promise<string> => {
    subscribedExchangeRates[rate] = 'N/A';
    return new Promise((resolve, reject) => {
        return database()
            .ref('/exchange-rates')
            .child('values')
            .child(rate)
            .on('value', (snapshot: any) => {
                const value = String(snapshot.val());
                subscribedExchangeRates[rate] = value;
                resolve(value);
            });
    });
};
