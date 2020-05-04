import * as IExtStorage from '../types';
import {
    IWalletsState
    // IWalletState,
    // IAccountState
} from '../../../redux/wallets/state';
// import { ChainIdType } from '../../blockchain/types';
// import { WalletType } from '../../wallet/types';

export const buildWallets = (trimmedWallets: IExtStorage.IStorageWallets) => {
    // console.log('trimmedWallets: ', trimmedWallets);
    const wallets: IWalletsState = {};

    Object.keys(trimmedWallets).map((walletId: string) => {
        // let wallet: IWalletState = {};
        const wallet = trimmedWallets[walletId];
        // let accounts: IAccountState[] = [];

        wallet.accounts.map(account => {
            // const tokens = {};
            // Object.keys(account.tokens).map((chainId: ChainIdType) => {
            //     Object.assign(tokensTrimmed, {
            //         ...tokensTrimmed,
            //         [chainId]: Object.keys(account.tokens[chainId])
            //     });
            // });
            // TODO
            // index: number;
            // selected: boolean;
            // name?: string;
            // blockchain: Blockchain;
            // address: string;
            // publicKey: string;
            // nonce?: number;
            // tokens: ITokensAccountState;
            // const acc: IAccountState = {};
            // const accountTrimmed = {
            //     index: account.index,
            //     name: account.name,
            //     address: account.address,
            //     publicKey: account.publicKey,
            //     tokens: tokensTrimmed
            // };
            // accountsTrimmed.push(accountTrimmed);
        });

        // const buildWallet: IWalletState = {
        //     name: wallet.name,
        //     type: wallet.type as WalletType,
        //     hwOptions: wallet?.hwOptions as any, // TODO: check
        //     accounts: accountsTrimmed,
        //     transactions: (wallet.transactions && Object.keys(wallet.transactions)) || [] // tx hash
        // };

        // Object.assign(trimmedWallets, {
        //     ...trimmedWallets,
        //     [walletId]: buildWallet
        // });
    });

    // addWallet

    // build tx

    // IWalletState

    // IAccountState
    // ITokensAccountState
    // ITokenState

    return wallets;
};
