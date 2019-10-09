import { ADD_MONEYZ } from '../actions/wallet';
import { IAction } from '../../types/actions';

const initialState = {
    money: 22
};

const walletReducer = (state = initialState, action: IAction) => {
    switch (action.type) {
        case ADD_MONEYZ:
            return {
                ...state,
                money: state.money + action.data
            };
        default:
            return state;
    }
};
export default walletReducer;
