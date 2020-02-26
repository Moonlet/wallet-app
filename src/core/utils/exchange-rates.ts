import firebase from 'react-native-firebase';

export const subscribeExchangeRates = (callback: any) => {
    const ref = firebase.database().ref('/exchange-rates');

    ref.on('value', (snapshot: any) => callback(snapshot.val()?.values));
};
