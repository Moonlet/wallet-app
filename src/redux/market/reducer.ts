import { IAction } from '../types';
import { EXCHANGE_RATES_UPDATE } from './actions';

const initialState: any = {
    exchangeRates: {
        BAT: 0.2648,
        BTC: 9805.56,
        CNY: 0,
        CRO: 0.06089,
        DAI: 1.001,
        ETH: 271.08,
        EUR: 1.082,
        HEDG: 2.807,
        HT: 4.728,
        JPY: 0.008995,
        LEO: 0.9643,
        LINK: 4.12,
        MKR: 646.25,
        OKB: 6.243,
        PAX: 1.001,
        SGD: 0,
        SNX: 1.002,
        USD: 1,
        USDC: 1.002,
        USDT: 1.001,
        ZIL: 0.007452
    },
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

export default (state: any = initialState, action: IAction) => {
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
