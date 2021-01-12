import { database } from 'react-native-firebase';

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
                return resolve(value);
            });
    });
};
