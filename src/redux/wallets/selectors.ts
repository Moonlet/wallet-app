import { IReduxState } from '../state';
import { ITransactionState, IAccountState, IWalletsState } from './state';
import { Blockchain } from '../../core/blockchain/types';

import { createSelector } from 'reselect';
import { ICurrentAccount } from '../app/state';

export const selectCurrentWallet = createSelector(
    [
        (state: IReduxState): IWalletsState => state.wallets,
        (state: IReduxState): string => state.app.currentWalletId
    ],
    (wallets, currendWalletId) => wallets[currendWalletId]
);

export const selectCurrentAccount = createSelector(
    [
        (state: IReduxState): IWalletsState => state.wallets,
        (state: IReduxState): string => state.app.currentWalletId,
        (state: IReduxState): ICurrentAccount => state.app.currentAccount
    ],
    (wallets, currentWalletId, currentAccount) =>
        wallets[currentWalletId]?.accounts.find(
            (account: IAccountState) =>
                account.index === currentAccount?.index &&
                account.blockchain === currentAccount?.blockchain
        )
);

export const getAccountTransactions = (
    state: IReduxState,
    accountIndex: number,
    blockchain: Blockchain
): ITransactionState[] => {
    const account: IAccountState = selectCurrentWallet(state).accounts.find(
        acc => acc.index === accountIndex && acc.blockchain === blockchain
    );
    const transactions = selectCurrentWallet(state).transactions;
    if (transactions) {
        return Object.values(selectCurrentWallet(state).transactions).filter(
            tx => tx.fromAddress === account.address
        );
    }
};

export const getCurrentAccountTransactions = (state: IReduxState): ITransactionState[] => {
    const account: IAccountState = selectCurrentWallet(state).accounts.find(
        acc =>
            acc.index === selectCurrentAccount(state).index &&
            acc.blockchain === selectCurrentAccount(state).blockchain
    );
    const transactions = selectCurrentWallet(state).transactions;
    if (transactions) {
        return Object.values(selectCurrentWallet(state).transactions).filter(
            tx => tx.fromAddress === account.address
        );
    }
};

export const getAccounts = (state: IReduxState, blockchain: Blockchain): IAccountState[] =>
    selectCurrentWallet(state).accounts.filter(acc => acc.blockchain === blockchain);

export const getAccount = (
    state: IReduxState,
    accountIndex: number,
    blockchain: Blockchain
): IAccountState =>
    selectCurrentWallet(state).accounts.find(
        acc => acc.index === accountIndex && acc.blockchain === blockchain
    );
