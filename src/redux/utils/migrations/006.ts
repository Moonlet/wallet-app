/**
 * Add gZil Token to all users - 12 September 2020
 */

import { accountToken } from '../../tokens/static-selectors';
import { Blockchain } from '../../../core/blockchain/types';

import { IWalletState, IAccountState } from '../../wallets/state';
import { GZIL_MAINNET } from '../../../core/blockchain/zilliqa/tokens/gzil';

export default (state: any) => {
    const zilChainIdMain = '1';

    if (
        state.tokens[Blockchain.ZILLIQA] &&
        state.tokens[Blockchain.ZILLIQA][zilChainIdMain] &&
        state.tokens[Blockchain.ZILLIQA][zilChainIdMain][GZIL_MAINNET.symbol]
    ) {
        // Update gZIL contract address
        state.tokens[Blockchain.ZILLIQA][zilChainIdMain][GZIL_MAINNET.symbol].contractAddress =
            GZIL_MAINNET.contractAddress;
    } else {
        // Add gZIL Token
        state.tokens = {
            ...state.tokens,
            [Blockchain.ZILLIQA]: {
                ...(state.tokens && state.tokens[Blockchain.ZILLIQA]),
                [zilChainIdMain]: {
                    ...(state.tokens &&
                        state.tokens[Blockchain.ZILLIQA] &&
                        state.tokens[Blockchain.ZILLIQA][zilChainIdMain]),
                    [GZIL_MAINNET.symbol]: GZIL_MAINNET
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
                    account.tokens[zilChainIdMain][GZIL_MAINNET.symbol]
                ) {
                    // gZIL has been already added
                } else {
                    // Add gZIL Token
                    account.tokens[zilChainIdMain][GZIL_MAINNET.symbol] = accountToken(
                        GZIL_MAINNET.symbol,
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
