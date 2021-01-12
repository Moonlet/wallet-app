import { database } from 'react-native-firebase';

export const subscribeExchangeRateValues = (rate: string, callback: (value: number) => void) =>
    database()
        .ref('/exchange-rates')
        .child('values')
        .child(rate)
        .on('value', (snapshot: any) => callback(snapshot));
