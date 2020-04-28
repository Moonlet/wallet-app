import { IWalletsState } from '../../redux/wallets/state';
import { IReduxState } from '../../redux/state';
import { cloneDeep } from 'lodash';
import * as IExtStorage from './types';
import { IPrefState } from '../../redux/preferences/state';
import { IContactsState } from '../../redux/contacts/state';

// TODO
export const trimWallets = (wallets: IWalletsState) => {
    const trimmedWallets = { ...wallets };

    // Object.keys(trimmedWallets).forEach(id => {
    //     const trimmedWallet: IExtStorage.IStorageWallets = cloneDeep(wallets[id]);
    //     delete trimmedWallet.selectedBlockchain;
    //     delete trimmedWallet.selected;

    //     trimmedWallet.accounts = trimmedWallet.accounts.map(account => {
    //         delete account.selected;
    //         return {
    //             ...account,
    //             balance: null
    //         };
    //     });

    //     trimmedWallets[id] = trimmedWallet;
    // });

    return trimmedWallets;
};

export const trimPreferences = (preferences: IPrefState): IExtStorage.IStoragePreferences => {
    return {
        currency: preferences.currency,
        testnet: preferences.testNet,
        networks: cloneDeep(preferences.networks),
        blockchains: Object.keys(preferences.blockchains)
    };
};

export const trimContacts = (contacts: IContactsState): IExtStorage.IStorageContact[] => {
    return Object.values(contacts);
};

// TODO: sanitise this
export const trimState = (state: IReduxState) => ({
    wallets: undefined, // trimWallets(state.wallets),
    contacts: trimContacts(state.contacts),
    preferences: trimPreferences(state.preferences),
    tokens: undefined // state.tokens
});

export const extensionState = (state: IReduxState): IExtStorage.IStorage => ({
    version: 1,
    state: trimState(state)
});
