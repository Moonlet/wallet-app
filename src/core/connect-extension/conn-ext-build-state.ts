import * as IExtStorage from './types';
import { ChainIdType } from '../blockchain/types';
import {
    ITokensConfigState
    // ITokenConfigState
} from '../../redux/tokens/state';
import {
    IWalletsState
    // IWalletState
} from '../../redux/wallets/state';

const buildTokens = (trimmedTokens: IExtStorage.IStorageTokens) => {
    // console.log('trimmedTokens: ', trimmedTokens);
    const tokens: ITokensConfigState = {};

    Object.keys(trimmedTokens).map((blockchain: string) => {
        Object.keys(trimmedTokens[blockchain]).map((chainId: ChainIdType) => {
            Object.values(trimmedTokens[blockchain][chainId]).map(
                (tk: { type: string; symbol: string; contract: string }) => {
                    //
                    // let token: ITokenConfigState = {};
                    // fetch tokens data
                    // Object.assign(trimmedTokens, {
                    //     ...trimmedTokens,
                    //     [blockchain]: {
                    //         ...(trimmedTokens && trimmedTokens[blockchain]),
                    //         [chainId]: {
                    //             ...(trimmedTokens[blockchain] &&
                    //                 trimmedTokens[blockchain][chainId]),
                    //             [token.symbol]: {
                    //                 type: token.type,
                    //                 symbol: token.symbol,
                    //                 contractAddress: token.contractAddress
                    //             }
                    //         }
                    //     }
                    // });
                }
            );
        });
    });

    return tokens;
};

const buildWallets = (trimmedWallets: IExtStorage.IStorageWallets) => {
    // console.log('trimmedWallets: ', trimmedWallets);
    const wallets: IWalletsState = {};

    Object.keys(trimmedWallets).map((walletId: string) => {
        // let wallet: IWalletState = {};
    });

    // addWallet

    // build tx

    // IWalletState

    // IAccountState
    // ITokensAccountState
    // ITokenState

    return wallets;
};

export const buildState = (extState: IExtStorage.IStorage) => {
    // console.log('extState: ', extState);
    return {
        app: {
            version: extState.version
        },
        wallets: buildWallets(extState.state.wallets),
        contacts: extState.state.contacts,
        preferences: extState.state.preferences,
        tokens: buildTokens(extState.state.tokens),
        market: undefined
    };
};
