import { createSelector } from 'reselect';
import { IReduxState } from '../state';
import { IAppState } from '../app/state';
import { IWalletState } from '../wallets/state';
import { IContactsState } from '../contacts/state';
import { IPrefState } from '../preferences/state';

import { isEqual } from 'lodash';
import { trimWallets } from '../../core/wallet-connect/wc-state-helper';
import { Platform } from 'react-native';
import { WalletConnectClient } from '../../core/wallet-connect/wallet-connect-client';
import { WC } from '../../core/constants/app';

let lastSentState: any = {};

const getStatePatch = createSelector(
    (state: IReduxState) => state.app,
    (state: IReduxState) => state.wallets,
    (state: IReduxState) => state.contacts,
    (state: IReduxState) => state.preferences,
    (
        app: IAppState,
        wallets: IWalletState[],
        contacts: IContactsState,
        preferences: IPrefState
    ) => {
        const trimmedWallets = trimWallets(wallets);
        const statePatch: any = {};

        if (!isEqual(app, lastSentState?.app)) {
            statePatch.app = app;
        }
        if (!isEqual(trimmedWallets, lastSentState?.wallets)) {
            statePatch.wallets = trimmedWallets;
        }
        if (!isEqual(preferences, lastSentState?.preferences)) {
            statePatch.preferences = preferences;
        }
        if (!isEqual(contacts, lastSentState?.contacts)) {
            statePatch.contacts = contacts;
        }

        if (statePatch) {
            lastSentState = { ...lastSentState, ...statePatch };
        }

        return statePatch;
    }
);

export const walletConnectMiddleware = store => next => action => {
    next(action);

    if (WalletConnectClient.isConnected() && Platform.OS !== 'web') {
        const statePatch = getStatePatch(store.getState());

        if (Object.keys(statePatch).length > 0) {
            WalletConnectClient.sendMessage(WC.UPDATE_STATE, statePatch).catch(() => {
                lastSentState = {};
            });
        }
    }
};
