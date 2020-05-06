import { IWalletsState, IWalletState, IAccountState } from '../../redux/wallets/state';
import { IReduxState } from '../../redux/state';
import { cloneDeep } from 'lodash';
import * as IExtStorage from './types';
import { IPrefState } from '../../redux/preferences/state';
import { IContactsState } from '../../redux/contacts/state';
import { ITokensConfigState, ITokenConfigState } from '../../redux/tokens/state';
import { ChainIdType, IBlockchainTransaction } from '../blockchain/types';

export const trimWallets = (wallets: IWalletsState) => {
    const trimmedWallets: IExtStorage.IStorageWallets = {};

    Object.keys(wallets).map((walletId: string) => {
        const wallet: IWalletState = wallets[walletId];
        const accountsTrimmed = [];

        wallet.accounts.map((account: IAccountState) => {
            const tokensTrimmed = {};

            Object.keys(account.tokens).map((chainId: ChainIdType) => {
                Object.assign(tokensTrimmed, {
                    ...tokensTrimmed,
                    [chainId]: Object.keys(account.tokens[chainId])
                });
            });

            const accountTrimmed = {
                index: account.index,
                selected: account.selected,
                name: account?.name,
                blockchain: account.blockchain,
                address: account.address,
                publicKey: account.publicKey,
                nonce: account?.nonce,
                tokens: tokensTrimmed
            };

            accountsTrimmed.push(accountTrimmed);
        });

        const txsTrimmed = {};

        wallet?.transactions &&
            Object.keys(wallet.transactions).map((txHash: string) => {
                const tx: IBlockchainTransaction = wallet.transactions[txHash];

                Object.assign(txsTrimmed, {
                    ...txsTrimmed,
                    [txHash]: {
                        blockchain: tx.blockchain,
                        chainId: tx.chainId,
                        broadcastedOnBlock: tx.broadcastedOnBlock
                    }
                });
            });

        const trimmedWallet: IExtStorage.IStorageWallet = {
            name: wallet.name,
            selected: wallet.selected,
            selectedBlockchain: wallet.selectedBlockchain,
            type: wallet.type,
            hwOptions: wallet?.hwOptions,
            accounts: accountsTrimmed,
            transactions: txsTrimmed
        };

        Object.assign(trimmedWallets, {
            ...trimmedWallets,
            [walletId]: trimmedWallet
        });
    });

    return trimmedWallets;
};

const trimTokens = (tokens: ITokensConfigState): IExtStorage.IStorageTokens => {
    const trimmedTokens: IExtStorage.IStorageTokens = {};

    Object.keys(tokens).map((blockchain: string) => {
        Object.keys(tokens[blockchain]).map((chainId: ChainIdType) => {
            Object.values(tokens[blockchain][chainId]).map((token: ITokenConfigState) => {
                Object.assign(trimmedTokens, {
                    ...trimmedTokens,
                    [blockchain]: {
                        ...(trimmedTokens && trimmedTokens[blockchain]),
                        [chainId]: {
                            ...(trimmedTokens[blockchain] && trimmedTokens[blockchain][chainId]),
                            [token.symbol]: {
                                type: token.type,
                                symbol: token.symbol,
                                contractAddress: token.contractAddress
                            }
                        }
                    }
                });
            });
        });
    });

    return trimmedTokens;
};

const trimPreferences = (preferences: IPrefState): IExtStorage.IStoragePreferences => {
    return {
        currency: preferences.currency,
        testNet: preferences.testNet,
        networks: cloneDeep(preferences.networks),
        blockchains: Object.keys(preferences.blockchains)
    };
};

const trimContacts = (contacts: IContactsState): IExtStorage.IStorageContact[] => {
    return Object.values(contacts);
};

const trimState = (state: IReduxState) => ({
    wallets: trimWallets(state.wallets),
    contacts: trimContacts(state.contacts),
    preferences: trimPreferences(state.preferences),
    tokens: trimTokens(state.tokens)
});

export const extensionState = (state: IReduxState): IExtStorage.IStorage => ({
    version: 1, // TODO: where to set this
    state: trimState(state)
});
