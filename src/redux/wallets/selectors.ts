import { IReduxState } from '../state';
import { IAccountState, IWalletsState, IWalletState } from './state';
import { Blockchain, IBlockchainTransaction } from '../../core/blockchain/types';

import { createSelector } from 'reselect';
import { getChainId, getBlockchains } from '../preferences/selectors';
import { ITokenConfig } from '../../core/blockchain/types/token';

export const getWalletSelectedBlockchain = createSelector(
    (state: IReduxState): IWalletState => getSelectedWallet(state),
    wallet => (wallet ? wallet.selectedBlockchain : '')
);

export const getSelectedBlockchain = (state: IReduxState) => {
    return getWalletSelectedBlockchain(state) || getBlockchains(state)[0];
};

export const getSelectedWallet = createSelector(
    (state: IReduxState) => state.wallets,
    (wallets: IWalletsState) => {
        return (
            Object.values(wallets).find(wallet => wallet.selected === true) ||
            Object.values(wallets)[0]
        );
    }
);

export const getSelectedAccount = createSelector(
    (state: IReduxState): IWalletState => getSelectedWallet(state),
    (state: IReduxState): Blockchain => getSelectedBlockchain(state),
    (wallet, selectedBlockchain) => {
        if (wallet === undefined) {
            return undefined;
        }
        const accounts = wallet.accounts.filter(
            account => account.blockchain === selectedBlockchain
        );
        const acc = accounts
            ? accounts.find(
                  (account: IAccountState) =>
                      account.selected === true && account.blockchain === wallet.selectedBlockchain
              )
            : undefined;
        return acc || accounts[0];
    }
);

export const getAccountFilteredTransactions = (
    state: IReduxState,
    accountIndex: number,
    blockchain: Blockchain,
    token: ITokenConfig
): IBlockchainTransaction[] => {
    const selectedWallet = getSelectedWallet(state);
    const chainId = getChainId(state, blockchain);

    const account: IAccountState = selectedWallet.accounts.find(
        acc => acc.index === accountIndex && acc.blockchain === blockchain
    );
    const transactions = selectedWallet.transactions;
    if (transactions) {
        return Object.values(selectedWallet.transactions)
            .filter(
                tx =>
                    (tx.address.toLowerCase() === account.address.toLowerCase() ||
                        tx.toAddress.toLowerCase() === account.address.toLowerCase()) &&
                    tx.blockchain === blockchain &&
                    tx.chainId === chainId &&
                    tx.token?.symbol === token.symbol
            )
            .sort(
                (tx1: IBlockchainTransaction, tx2: IBlockchainTransaction) =>
                    tx2.date?.signed - tx1.date?.signed
            );
    }
};

export const getSelectedAccountTransactions = (state: IReduxState): IBlockchainTransaction[] => {
    const selectedWallet = getSelectedWallet(state);
    const selectedAccount = getSelectedAccount(state);
    const blockchain = getSelectedBlockchain(state);

    const account: IAccountState = selectedWallet.accounts.find(
        acc => acc.index === selectedAccount.index && acc.blockchain === selectedAccount.blockchain
    );
    const transactions = selectedWallet.transactions;
    if (transactions) {
        return Object.values(selectedWallet.transactions)
            .filter(
                tx =>
                    (tx.address.toLowerCase() === account.address.toLowerCase() ||
                        tx.toAddress.toLowerCase() === account.address.toLowerCase()) &&
                    tx.blockchain === blockchain
            )
            .sort(
                (tx1: IBlockchainTransaction, tx2: IBlockchainTransaction) =>
                    tx2.date?.signed - tx1.date?.signed
            );
    }
};

export const getAccounts = (state: IReduxState, blockchain: Blockchain): IAccountState[] => {
    const accounts = getSelectedWallet(state).accounts.filter(acc => {
        if (acc.blockchain === blockchain) {
            return acc;
        }
    });

    return accounts;
};

export const getSelectedBlockchainAccounts = (state: IReduxState): IAccountState[] => {
    return (
        getSelectedWallet(state)?.accounts.filter(acc => {
            if (acc.blockchain === getSelectedBlockchain(state)) {
                return acc;
            }
        }) || []
    );
};

export const getAccount = (
    state: IReduxState,
    accountIndex: number,
    blockchain: Blockchain
): IAccountState =>
    getSelectedWallet(state).accounts.find(
        acc => acc.index === accountIndex && acc.blockchain === blockchain
    );

// search for wallet that contains specific address and return it
export const getWalletWithAddress = (
    state: IReduxState,
    addresses: string[],
    blockchain: Blockchain
): IWalletState[] =>
    Object.values(state.wallets).filter(wallet =>
        (wallet.accounts || []).some(
            account =>
                account.blockchain === blockchain &&
                addresses.includes(account.address.toLowerCase())
        )
    );
