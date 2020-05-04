import * as IExtStorage from '../types';
import { buildTokens } from './build-tokens';
import { buildWallets } from './build-wallets';

export const buildState = async (extState: IExtStorage.IStorage): Promise<any> => {
    return {
        app: {
            version: extState.version
        },
        wallets: buildWallets(extState.state.wallets),
        contacts: extState.state.contacts,
        preferences: extState.state.preferences,
        tokens: await buildTokens(extState.state.tokens),
        market: undefined // this is set in app.tsx
    };
};
