import { database } from 'react-native-firebase';

export const subscribeExchangeRateValues = (rate: string, callback: (value: number) => void) =>
    database()
        .ref('/exchange-rates')
        .child('values')
        .child(rate)
        .on('value', (snapshot: any) => callback(snapshot));

export const subscribeExchangeRateUpdated = (callback: (timestamp: string) => void) =>
    database()
        .ref('/exchange-rates')
        .child('updated')
        .on('value', (snapshot: any) => callback(snapshot));
