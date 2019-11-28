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
            return Object.keys(state).reduce((r, key) => {
                if (action.data.address !== key) {
                    r[key] = state[key];
                }
                return r;
            }, {});

        case CONTACT_UPDATE_NAME:
            return Object.values(state).map(contact =>
                contact === action.data.contactData
                    ? {
                          ...contact,
                          name: action.data.newName
                      }
                    : contact
            );

        default:
            break;
    }
    return state;
};
