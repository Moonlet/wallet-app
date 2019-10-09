import { IAction } from '../../types/actions';

export const ADD_MONEYZ = 'ADD_MONEYZ';

export function addMoney(sum: number): IAction {
    return {
        type: ADD_MONEYZ,
        data: sum
    };
}
