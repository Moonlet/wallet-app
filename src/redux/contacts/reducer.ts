import { IAction } from '../types';
import { IContactsState } from './state';
import { CONTACT_ADD } from './actions';

const intialState: IContactsState = {};

export default (state: IContactsState = intialState, action: IAction) => {
    switch (action.type) {
        case CONTACT_ADD:
            return {
                ...state,
                [action.data.address]: action.data
            };

        default:
            break;
    }
    return state;
};
