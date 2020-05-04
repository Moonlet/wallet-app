import * as IExtStorage from '../types';
import {
    IWalletsState,
    IWalletState,
    IAccountState,
    ITokensAccountState,
    ITokenState
} from '../../../redux/wallets/state';
import { ChainIdType, Blockchain } from '../../blockchain/types';
import { accountToken } from '../../../redux/tokens/static-selectors';

export const buildWallets = (trimmedWallets: IExtStorage.IStorageWallets): IWalletsState => {
    const wallets: IWalletsState = {};

    Object.keys(trimmedWallets).map((walletId: string, walletIndex: number) => {
        const wallet = trimmedWallets[walletId];
        const accounts: IAccountState[] = [];
        const transactions: any = {};

        wallet.accounts.map((account, accountIndex: number) => {
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
                selected: walletIndex === 0 && accountIndex === 0 ? true : false,
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
            name: wallet.name,
            selected: walletIndex === 0 ? true : false,
            selectedBlockchain: Blockchain.ZILLIQA, // by default the first blockchain is selected
            type: wallet.type,
            hwOptions: wallet?.hwOptions as any,
            accounts,
            transactions // TODO
        };

        Object.assign(wallets, {
            ...wallets,
            [walletId]: buildWallet
        });
    });

    return wallets;
};
