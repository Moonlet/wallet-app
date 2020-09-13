import AsyncStorage from '@react-native-community/async-storage';
import { createMigrate } from 'redux-persist';
import { getTokenConfig, accountToken } from '../tokens/static-selectors';
import { Blockchain } from '../../core/blockchain/types';
import { XSGD_MAINNET } from '../../core/blockchain/zilliqa/tokens/xsgd';
import { DAI_MAINNET } from '../../core/blockchain/ethereum/tokens/dai';
import { IWalletState, IAccountState } from '../wallets/state';
import { GZIL_MAINNET } from '../../core/blockchain/zilliqa/tokens/gzil';

const migrations = {
    /**
     * Update removable key in tokens state
     */
    2: (state: any) => {
        Object.keys(state.tokens).map(blockchain => {
            Object.keys(state.tokens[blockchain]).map(chainId => {
                Object.keys(state.tokens[blockchain][chainId]).map(symbolKey => {
                    const token = getTokenConfig(Blockchain[blockchain], symbolKey);
                    state.tokens[blockchain][chainId][symbolKey].removable = token
                        ? token.removable
                        : true;
                });
            });
        });
        return {
            ...state
        };
    },

    /**
     * Add XSGD and DAI Tokens for all users by default
     */
    3: (state: any) => {
        const zilChainIdMain = '1';

        if (
            state.tokens[Blockchain.ZILLIQA] &&
            state.tokens[Blockchain.ZILLIQA][zilChainIdMain] &&
            state.tokens[Blockchain.ZILLIQA][zilChainIdMain][XSGD_MAINNET.symbol]
        ) {
            // Update XSGD contract address
            state.tokens[Blockchain.ZILLIQA][zilChainIdMain][XSGD_MAINNET.symbol].contractAddress =
                XSGD_MAINNET.contractAddress;
        } else {
            // Add XSGD Token
            state.tokens = {
                ...state.tokens,
                [Blockchain.ZILLIQA]: {
                    ...(state.tokens && state.tokens[Blockchain.ZILLIQA]),
                    [zilChainIdMain]: {
                        ...(state.tokens &&
                            state.tokens[Blockchain.ZILLIQA] &&
                            state.tokens[Blockchain.ZILLIQA][zilChainIdMain]),
                        [XSGD_MAINNET.symbol]: XSGD_MAINNET
                    }
                }
            };
        }

        const ethChainIdMain = '1';

        if (
            state.tokens[Blockchain.ETHEREUM] &&
            state.tokens[Blockchain.ETHEREUM][ethChainIdMain] &&
            state.tokens[Blockchain.ETHEREUM][ethChainIdMain][DAI_MAINNET.symbol]
        ) {
            // DAI token has been already added
        } else {
            // Add DAI token

            state.tokens = {
                ...state.tokens,
                [Blockchain.ETHEREUM]: {
                    ...(state.tokens && state.tokens[Blockchain.ETHEREUM]),
                    [ethChainIdMain]: {
                        ...(state.tokens &&
                            state.tokens[Blockchain.ETHEREUM] &&
                            state.tokens[Blockchain.ETHEREUM][ethChainIdMain]),
                        [DAI_MAINNET.symbol]: DAI_MAINNET
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
                        account.tokens[zilChainIdMain][XSGD_MAINNET.symbol]
                    ) {
                        // XSGD has been already added
                    } else {
                        // Add XSGD Token
                        account.tokens[zilChainIdMain][XSGD_MAINNET.symbol] = accountToken(
                            XSGD_MAINNET.symbol,
                            999
                        );
                    }
                }

                // Ethereum
                if (account.blockchain === Blockchain.ETHEREUM) {
                    if (
                        account.tokens[ethChainIdMain] &&
                        account.tokens[ethChainIdMain][DAI_MAINNET.symbol]
                    ) {
                        // DAI has been already added
                    } else {
                        // Add DAI Token
                        account.tokens[ethChainIdMain][DAI_MAINNET.symbol] = accountToken(
                            DAI_MAINNET.symbol,
                            999
                        );
                    }
                }
            });
        });

        return {
            ...state
        };
    },
    /**
     * Update XSGD smartcontract address change
     */
    4: (state: any) => {
        const zilChainIdMain = '1';

        if (
            state.tokens[Blockchain.ZILLIQA] &&
            state.tokens[Blockchain.ZILLIQA][zilChainIdMain] &&
            state.tokens[Blockchain.ZILLIQA][zilChainIdMain][XSGD_MAINNET.symbol]
        ) {
            // Update XSGD contract address
            state.tokens[Blockchain.ZILLIQA][zilChainIdMain][XSGD_MAINNET.symbol].contractAddress =
                XSGD_MAINNET.contractAddress;
        }

        return {
            ...state
        };
    },
    /**
     * Add gZil Token to all users - 12 September 2020
     */ 5: (state: any) => {
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
    }
};

export const persistConfig = {
    key: 'root',
    version: 4,
    storage: AsyncStorage,
    blacklist: ['ui'],
    migrate: createMigrate(migrations, { debug: false })
};
