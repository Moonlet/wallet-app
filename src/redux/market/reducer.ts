import { IAction } from '../types';

const initialState = {
    exchangeRates: {
        // Native Tokens
        ZIL: {
            USD: 0.004778,
            EUR: 0.004293,
            JPY: 0.5241,
            SGD: 0.006416,
            CNY: 0.03273,
            USDT: 0.004723,
            DAI: 0.004802
        },
        ETH: {
            USD: 150.76,
            EUR: 135.54,
            JPY: 16481.83,
            SGD: 202.43,
            CNY: 1032.85,
            USDT: 150.85,
            DAI: 151.15,
            BTC: 0.017713
        },

        // ERC20 Tokens
        LEO: { ETH: 0.005713 },
        LINK: { ETH: 0.01501 },
        HT: { ETH: 0.02053 },
        HEDG: { ETH: 0.01471 },
        CRO: { ETH: 0.0002848 },
        MKR: { ETH: 3.246 },
        USDC: { ETH: 0.006639 },
        BAT: { ETH: 0.001281 },
        PAX: { ETH: 0.006644 },
        SNX: { ETH: 0.006693 },
        OKB: { ETH: 0.01938 },
        ZRX: { ETH: 0.001475 },
        CENNZ: { ETH: 0.0005804 },
        SXP: { ETH: 0.009383 },
        KCS: { ETH: 0.00701 },
        FAU: { ETH: 0.007 }
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

const intialState: any = initialState;

export default (state: any = intialState, action: IAction): any => {
    return intialState;
};
