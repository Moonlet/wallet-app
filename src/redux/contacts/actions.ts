import { IContactState } from './state';
import { Dispatch } from 'redux';
import { confirm } from '../../core/utils/dialog';
import { translate } from '../../core/i18n';
import { IAction } from '../types';
import { Blockchain } from '../../core/blockchain/types';

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
    if (await confirm(translate('Send.deleteContact'), '')) {
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
