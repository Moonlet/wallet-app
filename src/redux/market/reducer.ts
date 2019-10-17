import { IAction } from '../types';

const initialState = {
    usdPrices: {
        USD: 1,
        BTC: 8349.75,
        ETH: 182.25,
        ZIL: 0.005821,
        ATOM: 3.03,
        XLM: 0.06122
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
    return state;
};
