import { ADD_MONEYZ } from '../constants';

const initialState = {
  money: 0,
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
