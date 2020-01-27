import { IReduxState } from '../state';
import { IAccountState, IWalletsState, IWalletState } from './state';
import { Blockchain, IBlockchainTransaction } from '../../core/blockchain/types';

import { createSelector } from 'reselect';

export const getSelectedBlockchain = createSelector(
    (state: IReduxState): IWalletState => getSelectedWallet(state),
    wallet => {
        const selectedBlockchain = wallet ? wallet.selectedBlockchain : '';
        return selectedBlockchain;
    }
);

export const getSelectedWallet = createSelector(
    (state: IReduxState) => state.wallets,
    (wallets: IWalletsState) => {
        return Object.values(wallets).find(wallet => wallet.selected === true);
    }
);

export const getSelectedAccount = createSelector(
    (state: IReduxState): IWalletState => getSelectedWallet(state),
    wallet => {
        if (wallet === undefined) {
            return undefined;
        }
        const acc = wallet
            ? wallet.accounts.find((account: IAccountState) => account.selected === true)
            : undefined;
        return acc || wallet.accounts[0];
    }
);

export const getAccountTransactions = (
    state: IReduxState,
    accountIndex: number,
    blockchain: Blockchain
): IBlockchainTransaction[] => {
    const account: IAccountState = getSelectedWallet(state).accounts.find(
        acc => acc.index === accountIndex && acc.blockchain === blockchain
    );
    const transactions = getSelectedWallet(state).transactions;
    if (transactions) {
        return Object.values(getSelectedWallet(state).transactions).filter(
            tx => tx.address === account.address
        );
    }
};

export const getSelectedAccountTransactions = (state: IReduxState): IBlockchainTransaction[] => {
    const account: IAccountState = getSelectedWallet(state).accounts.find(
        acc =>
            acc.index === getSelectedAccount(state).index &&
            acc.blockchain === getSelectedAccount(state).blockchain
    );
    const transactions = getSelectedWallet(state).transactions;
    if (transactions) {
        return Object.values(getSelectedWallet(state).transactions).filter(
            tx => tx.address === account.address
        );
    }
};

export const getAccounts = (state: IReduxState, blockchain: Blockchain): IAccountState[] =>
    getSelectedWallet(state).accounts.filter(acc => acc.blockchain === blockchain);

export const getAccount = (
    state: IReduxState,
    accountIndex: number,
    blockchain: Blockchain
): IAccountState =>
    getSelectedWallet(state).accounts.find(
        acc => acc.index === accountIndex && acc.blockchain === blockchain
    );
