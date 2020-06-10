import { IBlockchainConfig, DerivationType } from '../types';
import { BigNumber } from 'bignumber.js';
import { TokenType, PosBasicActionType } from '../types/token';
import CeloIcon from '../../../assets/icons/blockchains/celo.svg';
import {
    CELO_GOLD_NATIVE,
    CELO_GOLD_MAINNET,
    CELO_GOLD_TESTNET_ALFAJORES,
    CELO_GOLD_TESTNET_BAKLAVA
} from './tokens/cGLD';
import {
    CELO_USD_MAINNET,
    CELO_USD_TESTNET_ALFAJORES,
    CELO_USD_TESTNET_BAKLAVA
} from './tokens/cUSD';

export const accountCTA = {
    mainCta: {
        title: 'App.labels.quickVote',
        iconName: 'vote',
        navigateTo: {
            screen: 'PosQuickDelegate',
            params: { actionText: 'App.labels.quickVote' }
        }
    }
};

const validatorCTA = {
    mainCta: {
        title: 'App.labels.vote',
        iconName: 'vote',
        navigateTo: {
            screen: 'PosDelegate',
            params: { actionText: 'App.labels.vote' }
        }
    },
    otherCtas: [
        {
            title: 'App.labels.revote',
            iconName: 'revote',
            navigateTo: {
                screen: 'PosRedelegate',
                params: { actionText: 'App.labels.revote' }
            }
        },
        {
            title: 'App.labels.unvote',
            iconName: 'unvote',
            navigateTo: {
                screen: 'PosBasicAction',
                params: { actionText: 'App.labels.unvote', basicAction: PosBasicActionType.UNVOTE }
            }
        },
        {
            title: 'App.labels.unlock',
            iconName: 'unlock',
            navigateTo: {
                screen: 'PosBasicAction',
                params: {
                    actionText: 'App.labels.unlock',
                    basicAction: PosBasicActionType.UNLOCK,
                    unlockDays: '3 days'
                }
            }
        }
    ]
};

export const config: IBlockchainConfig = {
    derivationPath: `m/44'/52752'/0'/0`,
    derivationType: DerivationType.HD_KEY,
    coin: 'cGLD',
    defaultUnit: 'WEI',
    iconComponent: CeloIcon,
    droppedTxBlocksThreshold: 50,
    autoAddedTokensSymbols: {
        42220: {
            cGLD: CELO_GOLD_MAINNET,
            cUSD: CELO_USD_MAINNET
        },
        44786: {
            cGLD: CELO_GOLD_TESTNET_ALFAJORES,
            cUSD: CELO_USD_TESTNET_ALFAJORES
        },
        40120: {
            cGLD: CELO_GOLD_TESTNET_BAKLAVA,
            cUSD: CELO_USD_TESTNET_BAKLAVA
        }
    },
    tokens: {
        cGLD: CELO_GOLD_NATIVE
    },
    feeOptions: {
        gasPriceToken: 'cGLD',
        defaults: {
            gasPrice: new BigNumber(5000000000),
            gasLimit: {
                [TokenType.ERC20]: new BigNumber(100000)
            }
        },
        ui: {
            availableTokenTypes: [TokenType.ERC20],
            feeComponent: 'FeeTotal',
            feeComponentAdvanced: 'GasFeeAdvanced',
            gasPriceUnit: 'GWEI',
            defaultPreset: 'standard'
        }
    },
    ui: {
        validator: {
            totalLabel: 'Validator.totalStake',
            amountCardLabel: 'Validator.myStake'
        },
        token: {
            labels: {
                tabAccount: 'App.labels.account',
                tabDelegations: 'App.labels.myVotes',
                tabValidators: 'App.labels.validators',
                tabTransactions: 'App.labels.transactions'
            },
            sendStepLabels: [
                'Validator.selectValidator',
                'App.labels.enterAmount',
                'Validator.confirmVote'
            ],
            accountCTA,
            delegationCTA: {
                mainCta: accountCTA.mainCta
            },
            validatorCTA
        },
        addressDisplay: 'stripped',
        enableTokenManagement: true,
        enableAccountCreation: false,
        maxAccountsNumber: 5,
        displayName: 'CELO'
    },
    networks: {
        testNet: 44786,
        mainNet: 42220
    },
    defaultOrder: 1
};

export enum Contracts {
    LOCKED_GOLD = 'LOCKED_GOLD',
    ELECTION = 'ELECTION',
    ACCOUNT = 'ACCOUNT'
}
