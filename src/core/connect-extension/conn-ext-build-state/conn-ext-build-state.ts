import * as IExtStorage from '../types';
import { buildTokens } from './build-tokens';
import { buildWallets } from './build-wallets';

export const buildState = async (extState: IExtStorage.IStorage): Promise<any> => {
    const tokens = await buildTokens(extState.state.tokens);
    const wallets = buildWallets(extState.state.wallets);

    return {
        app: {
            version: extState.version
        },
        wallets,
        contacts: extState.state.contacts,
        preferences: extState.state.preferences,
        tokens
    };
};
