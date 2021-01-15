/**
 * Add PORT Token to all users - 12 September 2020
 */

import { accountToken } from '../../tokens/static-selectors';
import { Blockchain } from '../../../core/blockchain/types';

import { IWalletState, IAccountState } from '../../wallets/state';
import { PORT_MAINNET } from '../../../core/blockchain/zilliqa/tokens/port';

export default (state: any) => {
    const zilChainIdMain = '1';

    if (
        state.tokens[Blockchain.ZILLIQA] &&
        state.tokens[Blockchain.ZILLIQA][zilChainIdMain] &&
        state.tokens[Blockchain.ZILLIQA][zilChainIdMain][PORT_MAINNET.symbol]
    ) {
        // Update PORT contract address
        state.tokens[Blockchain.ZILLIQA][zilChainIdMain][PORT_MAINNET.symbol].contractAddress =
            PORT_MAINNET.contractAddress;
    } else {
        // Add PORT Token
        state.tokens = {
            ...state.tokens,
            [Blockchain.ZILLIQA]: {
                ...(state.tokens && state.tokens[Blockchain.ZILLIQA]),
                [zilChainIdMain]: {
                    ...(state.tokens &&
                        state.tokens[Blockchain.ZILLIQA] &&
                        state.tokens[Blockchain.ZILLIQA][zilChainIdMain]),
                    [PORT_MAINNET.symbol]: PORT_MAINNET
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
                    account.tokens[zilChainIdMain][PORT_MAINNET.symbol]
                ) {
                    // PORT has been already added
                } else {
                    // Add PORT Token
                    account.tokens[zilChainIdMain][PORT_MAINNET.symbol] = accountToken(
                        PORT_MAINNET.symbol,
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
