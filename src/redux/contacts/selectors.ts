import { IReduxState } from '../state';
import {
    // IContactsState,
    IContactState
} from './state';
// import { Blockchain } from '../../core/blockchain/types';

export const selectContacts = (state: IReduxState): IContactState[] => {
    return Object.values(state.contacts).map((contact: IContactState) => contact);
};

// export const selectContacts = (state: IReduxState, blockchain: Blockchain): IContactsState[] => {
//     return [state.contacts];

//     // return Object.keys(state.contacts)
//     //     .map(k => state.contacts[k])
//     //     .filter(c => c.blockchain === blockchain);
// };

// TODO
// check if address is already in contacts
