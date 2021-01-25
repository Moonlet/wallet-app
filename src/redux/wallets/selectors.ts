import { IReduxState } from '../state';
import { AccountType, IAccountState, IWalletsState, IWalletState } from './state';
import { Blockchain, IBlockchainTransaction } from '../../core/blockchain/types';

import { createSelector } from 'reselect';
import { getChainId, getBlockchains } from '../preferences/selectors';
import { ITokenState } from '../wallets/state';
import { generateTokensConfig } from '../tokens/static-selectors';
import { TransactionStatus } from '../../core/wallet/types';

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

export const getWalletByPubKey = (reduxState: IReduxState, walletPubKey: string): IWalletState =>
    createSelector(
        (state: IReduxState) => state.wallets,
        (wallets: IWalletsState) => {
            return Object.values(wallets)?.find(
                w => w.id === walletPubKey || w.walletPublicKey === walletPubKey
            );
        }
    )(reduxState);

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
    token: ITokenState
): IBlockchainTransaction[] => {
    const selectedWallet = getSelectedWallet(state);
    const chainId = getChainId(state, blockchain);

    const account: IAccountState = selectedWallet.accounts.find(
        acc => acc.index === accountIndex && acc.blockchain === blockchain
    );
    const transactions = selectedWallet.transactions;

    const addressToLowercase = account.address.toLowerCase();

    if (transactions) {
        return Object.values(transactions)
            .filter(
                tx =>
                    (tx.address.toLowerCase() === addressToLowercase ||
                        tx.toAddress.toLowerCase() === addressToLowercase ||
                        (tx.data?.params &&
                            tx.data?.params[0]?.toLowerCase() === addressToLowercase)) &&
                    tx.blockchain === blockchain &&
                    tx.chainId === chainId &&
                    tx.token?.symbol?.toLowerCase() === token?.symbol?.toLowerCase()
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
    const chainId = getChainId(state, blockchain);

    if (selectedWallet === undefined || selectedAccount === undefined || blockchain === undefined)
        return [];

    const account: IAccountState = selectedWallet.accounts.find(
        acc => acc.index === selectedAccount.index && acc.blockchain === selectedAccount.blockchain
    );

    const addressToLowercase = account.address.toLowerCase();

    const transactions = selectedWallet.transactions;
    if (transactions) {
        return Object.values(selectedWallet.transactions)
            .filter(
                tx =>
                    (tx.address.toLowerCase() === addressToLowercase ||
                        tx.toAddress.toLowerCase() === addressToLowercase ||
                        (tx.data?.params &&
                            tx.data?.params[0]?.toLowerCase() === addressToLowercase)) &&
                    tx.blockchain === blockchain &&
                    tx.chainId === chainId
            )
            .sort(
                (tx1: IBlockchainTransaction, tx2: IBlockchainTransaction) =>
                    tx2.date?.created - tx1.date?.created
            );
    }
};

export const getAccounts = (state: IReduxState, blockchain: Blockchain): IAccountState[] => {
    const chainId = getChainId(state, blockchain);
    const accounts = getSelectedWallet(state).accounts.filter(account => {
        if (
            account.blockchain === blockchain &&
            (chainId === account?.chainId || account.chainId === undefined)
        ) {
            return account;
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
        (wallet?.accounts || []).some(
            account =>
                account.blockchain === blockchain &&
                addresses.includes(account.address.toLowerCase())
        )
    );

// search for wallet that contains specific transaction and return it
export const getWalletAndTransactionForHash = (
    state: IReduxState,
    transactionHash: string
): { walletId: string; transaction: IBlockchainTransaction } => {
    let transaction: IBlockchainTransaction;
    const wallets = Object.values(state.wallets).filter(wallet => {
        if ((wallet?.transactions || {})[transactionHash] !== undefined) {
            transaction = wallet.transactions[transactionHash];
            return wallet;
        }
    });
    if (wallets.length) return { walletId: wallets[0].id, transaction };
    return undefined;
};

export const generateAccountConfig = (blockchain: Blockchain): IAccountState => {
    return {
        index: 0,
        type: AccountType.DEFAULT,
        selected: false,
        publicKey: undefined,
        address: undefined,
        blockchain,
        tokens: generateTokensConfig(blockchain)
    };
};

export const getNrPendingTransactions = (state: IReduxState): number => {
    const transactions = getSelectedAccountTransactions(state) || [];

    const selectedAccount = getSelectedAccount(state);

    if (selectedAccount) {
        return transactions.filter(
            tx => tx.status === TransactionStatus.PENDING && tx.address === selectedAccount.address
        ).length;
    }

    return transactions.filter(tx => tx.status === TransactionStatus.PENDING).length;
};
