import * as IExtStorage from './types';

const buildTokens = (tokens: IExtStorage.IStorageTokens) => {
    // console.log('tokens: ', tokens);
    // fetch tokens data
    // ITokenConfigState
};

const buildWallets = (wallets: IExtStorage.IStorageWallets) => {
    // console.log('wallets: ', wallets);
    // addWallet
    // build tx
    // IWalletState
    // IAccountState
    // ITokensAccountState
    // ITokenState
};

export const buildState = (extState: IExtStorage.IStorage) => {
    // console.log('extState: ', extState);
    return {
        app: {
            version: extState.version
        },
        wallets: buildWallets(extState.state.wallets),
        contacts: extState.state.contacts,
        preferences: extState.state.preferences,
        tokens: buildTokens(extState.state.tokens),
        market: undefined // TODO
    };
};
