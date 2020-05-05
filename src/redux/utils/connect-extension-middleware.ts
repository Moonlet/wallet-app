import { createSelector } from 'reselect';
import { IReduxState } from '../state';
import { IAppState } from '../app/state';
import { IWalletsState } from '../wallets/state';
import { IContactsState } from '../contacts/state';
import { IPrefState } from '../preferences/state';

import { isEqual } from 'lodash';
import { Platform } from 'react-native';
import { ITokensConfigState } from '../tokens/state';
import { ConnectExtensionWeb } from '../../core/connect-extension/connect-extension-web';
import { ConnectExtension } from '../../core/connect-extension/connect-extension';

let lastSentState: any = {};

const getStatePatch = createSelector(
    (state: IReduxState) => state.app,
    (state: IReduxState) => state.wallets,
    (state: IReduxState) => state.contacts,
    (state: IReduxState) => state.preferences,
    (state: IReduxState) => state.tokens,
    (
        app: IAppState,
        wallets: IWalletsState,
        contacts: IContactsState,
        preferences: IPrefState,
        tokens: ITokensConfigState
    ) => {
        // const trimmedWallets = trimWallets(wallets);
        const statePatch: any = {};

        if (!isEqual(app, lastSentState?.app)) {
            statePatch.app = app;
        }
        if (!isEqual(wallets, lastSentState?.wallets)) {
            statePatch.wallets = wallets; // TODO: is trimmedWallets needed instead of wallets ?
        }
        if (!isEqual(preferences, lastSentState?.preferences)) {
            statePatch.preferences = preferences;
        }
        if (!isEqual(contacts, lastSentState?.contacts)) {
            statePatch.contacts = contacts;
        }

        if (!isEqual(tokens, lastSentState?.tokens)) {
            statePatch.tokens = tokens;
        }

        if (statePatch) {
            lastSentState = { ...lastSentState, ...statePatch };
        }

        return statePatch;
    }
);

const connectExtension = new ConnectExtension();

export const connectExtensionMiddleware = store => next => async action => {
    next(action);

    if (Platform.OS !== 'web' && (await ConnectExtensionWeb.isConnected())) {
        const statePatch = getStatePatch(store.getState());

        if (Object.keys(statePatch).length > 0) {
            try {
                const connection = await ConnectExtensionWeb.getConnection();

                if (connection) {
                    await connectExtension.syncExtension(connection);
                }
            } catch {
                lastSentState = {};
            }
        }
    }
};
