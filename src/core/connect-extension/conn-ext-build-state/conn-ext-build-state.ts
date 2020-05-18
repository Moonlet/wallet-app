import * as IExtStorage from '../types';
import { buildTokens } from './build-tokens';
import { buildWallets } from './build-wallets';
import { buildPreferences } from './build-preferences';

export const buildState = async (extState: IExtStorage.IStorage): Promise<any> => {
    const tokens = await buildTokens(extState.state.tokens);
    const wallets = buildWallets(extState.state.wallets);
    const preferences = buildPreferences(extState.state.preferences);

    return {
        app: {
            version: extState.version
        },
        wallets,
        contacts: extState.state.contacts,
        preferences,
        tokens
    };
};
