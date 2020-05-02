import { database } from 'firebase';

export const subscribeExchangeRates = (callback: any) => {
    const ref = database().ref('/exchange-rates');

    ref.on('value', (snapshot: any) => callback(snapshot.val()?.values));
};
