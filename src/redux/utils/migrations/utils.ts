import { accountToken } from '../../tokens/utils';
import { Blockchain } from '../../../core/blockchain/types';
import { IWalletState } from '../../wallets/state';

export const addToken = (
    state: any,
    token: any,
    data: {
        blockchain: Blockchain;
        chainId: string;
        tokenActive: boolean;
        order?: number;
    }
) => {
    if (
        state.tokens[data.blockchain] &&
        state.tokens[data.blockchain][data.chainId] &&
        state.tokens[data.blockchain][data.chainId][token.symbol]
    ) {
        // Update toke contract address
        state.tokens[data.blockchain][data.chainId][token.symbol].contractAddress =
            token.contractAddress;
    } else {
        // Add token Token
        state.tokens = {
            ...state.tokens,
            [data.blockchain]: {
                ...(state.tokens && state.tokens[data.blockchain]),
                [data.chainId]: {
                    ...(state.tokens &&
                        state.tokens[data.blockchain] &&
                        state.tokens[data.blockchain][data.chainId]),
                    [token.symbol]: token
                }
            }
        };
    }

    // Add tokens on accounts
    for (const wallet of Object.values(state.wallets)) {
        for (const account of (wallet as IWalletState).accounts) {
            if (account.blockchain === data.blockchain) {
                if (account.tokens[data.chainId] && account.tokens[data.chainId][token.symbol]) {
                    // Token has been already added
                } else {
                    // Add Token
                    account.tokens[data.chainId][token.symbol] = accountToken(
                        token.symbol,
                        data.order || 999,
                        {
                            active: data.tokenActive
                        }
                    );
                }
            }
        }
    }

    return {
        ...state
    };
};
