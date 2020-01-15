import { IContactState } from './state';
import { Dispatch } from 'redux';
import { translate } from '../../core/i18n';
import { IAction } from '../types';
import { Blockchain } from '../../core/blockchain/types';
import { Dialog } from '../../components/dialog/dialog';

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

export const deleteContact = (blockchain: Blockchain, address: string) => async (
    dispatch: Dispatch<IAction<any>>
) => {
    if (await Dialog.confirm(translate('Send.deleteContact'), '')) {
        dispatch({
            type: CONTACT_DELETE,
            data: { blockchain, address }
        });
    }
};

export const updateContactName = (contactData: IContactState) => {
    return {
        type: CONTACT_UPDATE_NAME,
        data: contactData
    };
};
