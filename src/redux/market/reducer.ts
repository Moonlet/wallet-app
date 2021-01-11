import { IAction } from '../types';
import {
    EXCHANGE_RATE_UPDATE,
    EXCHANGE_RATES_UPDATE,
    EXCHANGE_RATES_TIME_UPDATED
} from './actions';
import { IMarketState } from './state';

const initialState: IMarketState = {
    exchangeRates: {},
    options: {
        timestamp: undefined,
        isLoading: false
    }
};

export default (state: any = initialState, action: IAction): IMarketState => {
    switch (action.type) {
        case EXCHANGE_RATE_UPDATE:
            return {
                ...state,
                exchangeRates: {
                    ...state.exchangeRates,
                    [action.data.token]: action.data.value
                }
            };

        case EXCHANGE_RATES_UPDATE:
            return {
                ...state,
                exchangeRates: action.data
            };

        case EXCHANGE_RATES_TIME_UPDATED:
            return {
                ...state,
                options: {
                    ...state.options,
                    timestamp: action.data
                }
            };

        default:
            break;
    }

    return state;
};
