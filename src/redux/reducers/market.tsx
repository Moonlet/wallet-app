import { REQUEST_PRICE, RECEIVE_PRICE } from '../actions/market';

const initialState = {
    loading: false,
    price: {
        eth: 0
    }
};

const reducer = (state = initialState, action: any) => {
    switch (action.type) {
        case REQUEST_PRICE:
            return { ...state, loading: true };
        case RECEIVE_PRICE:
            return { ...state, price: { eth: action.price }, loading: false };
        default:
            return state;
    }
};

export default reducer;
