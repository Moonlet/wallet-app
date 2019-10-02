import { ADD_MONEYZ } from '../constants';

export function addMoney(sum: number) {
  return {
    type: ADD_MONEYZ,
    payload: sum,
  };
}
