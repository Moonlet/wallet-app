import { IAction } from '../types';
import { IContactsState } from './state';
import { CONTACT_ADD, CONTACT_DELETE, CONTACT_UPDATE_NAME } from './actions';

const intialState: IContactsState = {};

export default (state: IContactsState = intialState, action: IAction) => {
    switch (action.type) {
        case CONTACT_ADD:
            return {
                ...state,
                [`${action.data.blockchain}|${action.data.address}`]: action.data
            };

        case CONTACT_DELETE:
            delete state[`${action.data.blockchain}|${action.data.address}`];
            return { ...state };

        case CONTACT_UPDATE_NAME:
            return {
                ...state,
                [`${action.data.blockchain}|${action.data.address}`]: {
                    ...state[`${action.data.blockchain}|${action.data.address}`],
                    name: action.data.name
                }
            };

        default:
            break;
    }
    return state;
};
