import { database } from 'react-native-firebase';

export const subscribedExchangeRates = {};

export const subscribeExchangeRateValue = (rate: string, callback: (value: string) => void) =>
    database()
        .ref('/exchange-rates')
        .child('values')
        .child(rate)
        .on('value', (snapshot: any) => {
            const value = String(snapshot.val());
            subscribedExchangeRates[rate] = value;
            return callback(value);
        });
