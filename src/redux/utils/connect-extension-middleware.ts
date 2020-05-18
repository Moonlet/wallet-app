import { createSelector } from 'reselect';
import { IReduxState } from '../state';
import { IWalletsState } from '../wallets/state';
import { IContactsState } from '../contacts/state';
import { IPrefState } from '../preferences/state';
import { ITokensConfigState } from '../tokens/state';

import { isEqual } from 'lodash';
import { Platform } from 'react-native';
import { ConnectExtensionWeb } from '../../core/connect-extension/connect-extension-web';
import { ConnectExtension } from '../../core/connect-extension/connect-extension';
import {
    trimWallets,
    trimTokens,
    trimContacts,
    trimPreferences
} from '../../core/connect-extension/conn-ext-trim-state';
import { hash } from '../../core/secure/encrypt/encrypt';
import { getItemFromStorage, storeItemToStorage } from '../../core/secure/storage/storage';
import { CONN_EXTENSION } from '../../core/constants/app';

let lastSentState: any = {};

const getStatePatch = createSelector(
    (state: IReduxState) => state.wallets,
    (state: IReduxState) => state.contacts,
    (state: IReduxState) => state.preferences,
    (state: IReduxState) => state.tokens,
    (
        wallets: IWalletsState,
        contacts: IContactsState,
        preferences: IPrefState,
        tokens: ITokensConfigState
    ) => {
        const statePatch: any = {};

        const trimmedWallets = trimWallets(wallets);
        if (!isEqual(trimmedWallets, lastSentState?.trimmedWallets)) {
            statePatch.trimmedWallets = trimmedWallets;
        }

        const trimmedContacts = trimContacts(contacts);
        if (!isEqual(trimmedContacts, lastSentState?.trimmedContacts)) {
            statePatch.trimmedContacts = trimmedContacts;
        }

        const trimmedPreferences = trimPreferences(preferences);
        if (!isEqual(trimmedPreferences, lastSentState?.trimmedPreferences)) {
            statePatch.trimmedPreferences = trimmedPreferences;
        }

        const trimmedTokens = trimTokens(tokens);
        if (!isEqual(trimmedTokens, lastSentState?.trimmedTokens)) {
            statePatch.trimmedTokens = trimmedTokens;
        }

        if (statePatch) {
            lastSentState = {
                ...lastSentState,
                ...statePatch
            };
        }

        return statePatch;
    }
);

let timer;
const CONN_EXTENSION_STATE = `${CONN_EXTENSION}State`;

export const connectExtensionMiddleware = store => next => async action => {
    next(action);

    timer && clearTimeout(timer);

    timer = setTimeout(async () => {
        if (Platform.OS !== 'web' && (await ConnectExtensionWeb.isConnected())) {
            const statePatch = getStatePatch(store.getState());

            const currentStateHash = await hash(JSON.stringify(statePatch));

            try {
                const storageStateHash = await getItemFromStorage(CONN_EXTENSION_STATE);

                if (storageStateHash && storageStateHash !== currentStateHash) {
                    // Sync Extension with the new state
                    if (Object.keys(statePatch).length > 0) {
                        try {
                            const connection = await ConnectExtensionWeb.getConnection();

                            if (connection) {
                                await ConnectExtension.syncExtension(connection);
                            }
                        } catch {
                            lastSentState = {};
                        }
                    }

                    // Save State Hash to Async Storage
                    await storeItemToStorage(currentStateHash, CONN_EXTENSION_STATE);
                }
            } catch {
                // Save State Hash to Async Storage
                await storeItemToStorage(currentStateHash, CONN_EXTENSION_STATE);
            }
        }
    }, 200);
};
