import { IContactState } from './state';
import { IReduxState } from '../state';
import { Dispatch } from 'redux';

// actions consts
export const CONTACT_ADD = 'CONTACT_ADD';
export const CONTACT_DELETE = 'CONTACT_DELETE';
export const CONTACT_UPDATE_NAME = 'CONTACT_UPDATE_NAME';

export const addContact = (contactData: IContactState) => {
    return {
        type: CONTACT_ADD,
        data: contactData
    };
};

export const deleteContact = (contactData: IContactState) => {
    return {
        type: CONTACT_DELETE,
        data: contactData
    };
};

export const updateContactName = (contactData: IContactState) => {
    return {
        type: CONTACT_UPDATE_NAME,
        data: contactData
    };
};

export const isContactAlreadySaved = (address: string) => (
    dispatch: Dispatch,
    getState: () => IReduxState
) => {
    const state = getState();
    return Object.keys(state.contacts).some(c => c === address);
};
