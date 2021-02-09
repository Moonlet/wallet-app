import { database } from 'react-native-firebase';
import { store } from '../../redux/config';
import { EXCHANGE_RATE_UPDATE } from '../../redux/market/actions';

const subscribedExchangeRates = [];

export const subscribeExchangeRateValue = (token: string): void => {
    if (subscribedExchangeRates.indexOf(token) < 0) {
        subscribedExchangeRates.push(token);

        database()
            .ref('/exchange-rates')
            .child('values')
            .child(token)
            .on('value', (snapshot: any) => {
                const value = String(snapshot.val());
                if (store) {
                    store.dispatch({
                        type: EXCHANGE_RATE_UPDATE,
                        data: {
                            token,
                            value
                        }
                    });
                }
            });
    }
};
