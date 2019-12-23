import { IReduxState } from '../state';
import { ITransactionState, IAccountState, IWalletState } from './state';
import { Blockchain } from '../../core/blockchain/types';

import { createSelector } from 'reselect';
import { ICurrentAccount } from '../app/state';

export const selectCurrentWallet = createSelector(
    [
        (state: IReduxState): IWalletState[] => state.wallets,
        (state: IReduxState): string => state.app.currentWalletId
    ],
    (wallets, currentWalletId) => wallets.find(wallet => wallet.id === currentWalletId)
);

export const selectCurrentAccount = createSelector(
    [
        (state: IReduxState): IWalletState[] => state.wallets,
        (state: IReduxState): string => state.app.currentWalletId,
        (state: IReduxState): ICurrentAccount => state.app.currentAccount
    ],
    (wallets, currentWalletId, currentAccount) =>
        wallets
            .find(wallet => wallet.id === currentWalletId)
            ?.accounts.find(
                (account: IAccountState) =>
                    account.index === currentAccount.index &&
                    account.blockchain === currentAccount.blockchain
            )
);

export const getAccountTransactions = (
    state: IReduxState,
    accountIndex: number,
    blockchain: Blockchain
): ITransactionState[] => {
    const account = selectCurrentWallet(state).accounts.filter(
        acc => acc.index === accountIndex && acc.blockchain === blockchain
    )[0];
    const transactions = selectCurrentWallet(state).transactions;
    if (transactions) {
        return Object.values(selectCurrentWallet(state).transactions).filter(
            tx => tx.fromAddress === account.address
        );
    }
};

export const getAccounts = (state: IReduxState, blockchain: Blockchain): IAccountState[] => {
    return selectCurrentWallet(state).accounts.filter(acc => acc.blockchain === blockchain);
};

export const getAccount = (
    state: IReduxState,
    accountIndex: number,
    blockchain: Blockchain
): IAccountState => {
    return selectCurrentWallet(state).accounts.filter(
        acc => acc.index === accountIndex && acc.blockchain === blockchain
    )[0];
};
