import { database } from 'react-native-firebase';

export const subscribeExchangeRate = (rate: string, callback: any) =>
    database()
        .ref('/exchange-rates')
        .child('values')
        .child(rate)
        .on('value', (snapshot: any) => callback(snapshot));
