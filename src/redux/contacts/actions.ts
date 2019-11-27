import { IContactState } from './state';

// actions consts
export const CONTACT_ADD = 'CONTACT_ADD';

export const addContact = (contactData: IContactState) => {
    return {
        type: CONTACT_ADD,
        data: contactData
    };
};
