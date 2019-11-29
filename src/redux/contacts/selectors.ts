import { IReduxState } from '../state';
import { IContactState, IContactsState } from './state';
import { Blockchain } from '../../core/blockchain/types';

export const getContacts = (state: IReduxState): IContactsState => state.contacts;

export const selectContacts = (state: IReduxState, blockchain: Blockchain): IContactState[] => {
    let currentLetter = '';

    return Object.values(state.contacts)
        .filter(c => c.blockchain === blockchain)
        .sort((a, b) => (a.name > b.name ? 1 : -1))
        .reduce((sortedList = [], contact) => {
            const firstLetter = contact.name[0];
            if (firstLetter !== currentLetter) {
                currentLetter = firstLetter;
                sortedList.push({
                    title: firstLetter.toUpperCase(),
                    data: []
                });
            }

            sortedList[sortedList.length - 1].data.push(contact);
            return sortedList;
        }, []);
};
