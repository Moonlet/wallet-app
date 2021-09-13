import * as IExtStorage from '../types';
import {
    IWalletsState,
    IWalletState,
    IAccountState,
    ITokensAccountState,
    ITokenState,
    IWalletHWOptions
} from '../../../redux/wallets/state';
import { ChainIdType } from '../../blockchain/types';
import { accountToken } from '../../../redux/tokens/utils';

export const buildWallets = (trimmedWallets: IExtStorage.IStorageWallets): IWalletsState => {
    const wallets: IWalletsState = {};

    Object.keys(trimmedWallets).map((walletId: string) => {
        const wallet = trimmedWallets[walletId];
        const accounts: IAccountState[] = [];

        wallet.accounts.map(account => {
            const accountTokens: ITokensAccountState = {};

            Object.keys(account.tokens).map((chainId: ChainIdType) => {
                account.tokens[chainId].map((symbol: string, index: number) => {
                    const token: ITokenState = accountToken(symbol, index);

                    Object.assign(accountTokens, {
                        ...accountTokens,
                        [chainId]: {
                            ...accountTokens[chainId],
                            [symbol]: token
                        }
                    });
                });
            });

            const acc: IAccountState = {
                index: account.index,
                type: account.type,
                selected: account.selected,
                name: account?.name,
                blockchain: account.blockchain,
                address: account.address,
                publicKey: account.publicKey,
                nonce: account?.nonce,
                tokens: accountTokens
            };

            accounts.push(acc);
        });

        const buildWallet: IWalletState = {
            id: walletId,
            walletPublicKey: wallet.walletPublicKey,
            name: wallet.name,
            selected: wallet.selected,
            selectedBlockchain: wallet.selectedBlockchain,
            type: wallet.type,
            hwOptions: wallet?.hwOptions as IWalletHWOptions,
            accounts,
            transactions: {}
        };

        Object.assign(wallets, {
            ...wallets,
            [walletId]: buildWallet
        });
    });

    return wallets;
};
