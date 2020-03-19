import { IWalletsState, IWalletState } from '../../redux/wallets/state';
import { IReduxState } from '../../redux/state';
import { cloneDeep } from 'lodash';

export const trimWallets = (wallets: IWalletsState) => {
    const trimmedWallets = { ...wallets };

    Object.keys(trimmedWallets).forEach(id => {
        const trimmedWallet: IWalletState = cloneDeep(wallets[id]);
        delete trimmedWallet.selectedBlockchain;
        delete trimmedWallet.selected;

        trimmedWallet.accounts = trimmedWallet.accounts.map(account => {
            delete account.selected;
            return {
                ...account,
                balance: null
            };
        });

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
