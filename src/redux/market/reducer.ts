import { IAction } from '../types';
import { EXCHANGE_RATE_UPDATE } from './actions';
import { IMarketState } from './state';

const initialState: IMarketState = {
    exchangeRates: {}
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

        default:
            break;
    }

    return state;
};
