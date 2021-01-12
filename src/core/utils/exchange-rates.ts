import { database } from 'react-native-firebase';

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
