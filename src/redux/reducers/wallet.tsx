import { ADD_MONEYZ } from '../actions/wallet';

const initialState = {
  money: 22,
};

const walletReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case ADD_MONEYZ:
      return {
        ...state,
        money: state.money + action.payload,
      };
    default:
      return state;
  }
};
export default walletReducer;
