import { IWalletState } from '../../redux/wallets/state';
import { IReduxState } from '../../redux/state';

export const trimWallets = (wallets: IWalletState[]) =>
    wallets.map((wallet: IWalletState) => {
        const trimmedWallet = { ...wallet };
        delete trimmedWallet.transactions;

        trimmedWallet.accounts = trimmedWallet.accounts.map(account => ({
            ...account,
            balance: null
        }));

        return trimmedWallet;
    });

export const trimState = (state: IReduxState) => ({
    app: state.app,
    wallets: trimWallets(state.wallets),
    contacts: state.contacts,
    preferences: state.preferences
});
