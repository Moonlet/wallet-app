import { IReduxState } from '../state';
import { IWalletState } from './state';

export const selectCurrentWallet = (state: IReduxState): IWalletState =>
    state.wallets.find(wallet => wallet.id === state.app.currentWalletId);
import { ITransactionState } from './state';

export const getAccountTransactions = (state: IReduxState): { [id: string]: ITransactionState } => {
    return state.wallets[state.app.currentWalletIndex].transactions;
};

export const getAccountName = (
    state: IReduxState,
    accountIndex?: number,
    address?: string
): string => {
    if (accountIndex) {
        const account = state.wallets[state.app.currentWalletIndex].accounts[accountIndex];
        if (account.name) {
            return account.name;
        } else {
            return 'Account ' + (accountIndex + 1);
        }
    } else if (address) {
        const account = state.wallets[state.app.currentWalletIndex].accounts.filter(
            acc => acc.address === address
        )[0];
        if (account.name) {
            return account.name;
        } else {
            return 'Account ' + (accountIndex + 1);
        }
    } else {
        return '';
    }
};
