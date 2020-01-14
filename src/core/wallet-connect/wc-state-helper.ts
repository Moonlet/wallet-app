import { IWalletsState } from '../../redux/wallets/state';
import { IReduxState } from '../../redux/state';

export const trimWallets = (wallets: IWalletsState) => {
    const trimmedWallets = { ...wallets };

    Object.keys(trimmedWallets).forEach(id => {
        const trimmedWallet = { ...wallets[id] };
        // delete trimmedWallet.transactions;

        trimmedWallet.accounts = trimmedWallet.accounts.map(account => ({
            ...account,
            balance: null
        }));

        trimmedWallets[id] = trimmedWallet;
    });

    return trimmedWallets;
};

export const trimState = (state: IReduxState) => ({
    app: state.app,
    wallets: trimWallets(state.wallets),
    contacts: state.contacts,
    preferences: state.preferences
});
