import firebase from 'react-native-firebase';

export const getExchangeRates = async () => {
    const ref = firebase.database().ref('/exchange-rates');

    const snapshot = await ref.once('value');

    return snapshot.val()?.values;
};
