import { IAction } from '../types';
import { IContactsState } from './state';
import { CONTACT_ADD, CONTACT_DELETE, CONTACT_UPDATE_NAME } from './actions';

const intialState: IContactsState = {};

export default (state: IContactsState = intialState, action: IAction) => {
    switch (action.type) {
        case CONTACT_ADD:
            return {
                ...state,
                [action.data.address]: action.data
            };

        case CONTACT_DELETE:
            return Object.keys(state)
                .filter(key => key !== action.data.address)
                .reduce((result, current) => {
                    result[current] = state[current];
                    return result;
                }, {});

        case CONTACT_UPDATE_NAME:
            const newState = state;
            newState[action.data.address] = action.data;
            return newState;

        default:
            break;
    }
    return state;
};
