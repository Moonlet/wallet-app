import { IAction } from '../types';
import { EXCHANGE_RATES_UPDATE } from './actions';
import { IMarketState } from './state';

const initialState: IMarketState = {
    exchangeRates: {},
    change: {
        daily: {
            USD: {
                USD: 0,
                BTC: 0.0045,
                ETH: -0.0016
            },
            BTC: {
                USD: 0.0043,
                BTC: 0,
                ETH: -0.0016
            },
            ETH: {
                USD: 0.0143,
                BTC: 0.0045,
                ETH: 0
            },
            ZIL: {
                USD: 0.0002,
                BTC: 0.0045,
                ETH: 0.0216
            },
            ATOM: {
                USD: 0.0045,
                BTC: -0.0045,
                ETH: -0.0016
            },
            XLM: {
                USD: 0.0045,
                BTC: 0.0033,
                ETH: -0.0016
            }
        }
    }
};

export default (state: any = initialState, action: IAction): IMarketState => {
    switch (action.type) {
        case EXCHANGE_RATES_UPDATE:
            return {
                ...state,
                exchangeRates: action.data
            };

        default:
            break;
    }

    return state;
};
