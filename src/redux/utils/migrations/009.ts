/**
 * Add ZWAP Token to all users - 2 Feb 2021
 */

import { accountToken } from '../../tokens/static-selectors';
import { Blockchain } from '../../../core/blockchain/types';

import { IWalletState, IAccountState } from '../../wallets/state';
import { ZWAP_MAINNET } from '../../../core/blockchain/zilliqa/tokens/zwap';

export default (state: any) => {
    const zilChainIdMain = '1';

    if (
        state.tokens[Blockchain.ZILLIQA] &&
        state.tokens[Blockchain.ZILLIQA][zilChainIdMain] &&
        state.tokens[Blockchain.ZILLIQA][zilChainIdMain][ZWAP_MAINNET.symbol]
    ) {
        // Update ZWAP contract address
        state.tokens[Blockchain.ZILLIQA][zilChainIdMain][ZWAP_MAINNET.symbol].contractAddress =
            ZWAP_MAINNET.contractAddress;
    } else {
        // Add ZWAP Token
        state.tokens = {
            ...state.tokens,
            [Blockchain.ZILLIQA]: {
                ...(state.tokens && state.tokens[Blockchain.ZILLIQA]),
                [zilChainIdMain]: {
                    ...(state.tokens &&
                        state.tokens[Blockchain.ZILLIQA] &&
                        state.tokens[Blockchain.ZILLIQA][zilChainIdMain]),
                    [ZWAP_MAINNET.symbol]: ZWAP_MAINNET
                }
            }
        };
    }
    // Add tokens on accounts
    Object.values(state.wallets).map((wallet: IWalletState) => {
        wallet.accounts.map((account: IAccountState) => {
            // Zilliqa
            if (account.blockchain === Blockchain.ZILLIQA) {
                if (
                    account.tokens[zilChainIdMain] &&
                    account.tokens[zilChainIdMain][ZWAP_MAINNET.symbol]
                ) {
                    // ZWAP has been already added
                } else {
                    // Add ZWAP Token
                    account.tokens[zilChainIdMain][ZWAP_MAINNET.symbol] = accountToken(
                        ZWAP_MAINNET.symbol,
                        999
                    );
                }
            }
        });
    });

    return {
        ...state
    };
};
