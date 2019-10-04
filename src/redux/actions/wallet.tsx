export const ADD_MONEYZ = 'ADD_MONEYZ';

export function addMoney(sum: number) {
  return {
    type: ADD_MONEYZ,
    payload: sum,
  };
}
