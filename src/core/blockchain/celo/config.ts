import { IBlockchainConfig, DerivationType } from '../types';
import { BigNumber } from 'bignumber.js';
import { TokenType, PosBasicActionType } from '../types/token';
import CeloIcon from '../../../assets/icons/blockchains/celo.svg';
import {
    CELO_GOLD_NATIVE,
    CELO_GOLD_MAINNET,
    CELO_GOLD_TESTNET_ALFAJORES,
    CELO_GOLD_TESTNET_BAKLAVA
} from './tokens/celo';
import {
    CELO_USD_MAINNET,
    CELO_USD_TESTNET_ALFAJORES,
    CELO_USD_TESTNET_BAKLAVA
} from './tokens/cUSD';
import { IconValues } from '../../../components/icon/values';
import { AffiliateBannerType } from '../../../components/affiliate-banner/types';

export const accountCTA = {
    mainCta: {
        title: 'App.labels.quickVote',
        iconName: IconValues.VOTE,
        navigateTo: {
            screen: 'PosQuickDelegate',
            params: { actionText: 'App.labels.quickVote' }
        }
    }
};

const validatorCTA = {
    mainCta: {
        title: 'App.labels.vote',
        iconName: IconValues.VOTE,
        navigateTo: {
            screen: 'PosDelegate',
            params: { actionText: 'App.labels.vote' }
        }
    },
    otherCtas: [
        {
            title: 'App.labels.revote',
            iconName: IconValues.REVOTE,
            navigateTo: {
                screen: 'PosRedelegate',
                params: { actionText: 'App.labels.revote' }
            }
        },
        {
            title: 'App.labels.unvote',
            iconName: IconValues.UNVOTE,
            navigateTo: {
                screen: 'PosBasicAction',
                params: { actionText: 'App.labels.unvote', basicAction: PosBasicActionType.UNVOTE }
            }
        },
        {
            title: 'App.labels.unlock',
            iconName: IconValues.UNLOCK,
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
    coin: 'CELO',
    defaultUnit: 'WEI',
    iconComponent: CeloIcon,
    droppedTxBlocksThreshold: 50,
    autoAddedTokensSymbols: {
        42220: {
            CELO: CELO_GOLD_MAINNET,
            cUSD: CELO_USD_MAINNET
        },
        44787: {
            CELO: CELO_GOLD_TESTNET_ALFAJORES,
            cUSD: CELO_USD_TESTNET_ALFAJORES
        },
        62320: {
            CELO: CELO_GOLD_TESTNET_BAKLAVA,
            cUSD: CELO_USD_TESTNET_BAKLAVA
        }
    },
    tokens: {
        CELO: CELO_GOLD_NATIVE
    },
    feeOptions: {
        gasPriceToken: 'CELO',
        defaults: {
            gasPrice: new BigNumber(5000000000),
            gasLimit: {
                [TokenType.ERC20]: new BigNumber(400000)
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
            totalLabel: 'Validator.totalVotes',
            amountCardLabel: 'App.labels.myVotes',
            maximumNumberOfValidators: 5
        },
        token: {
            labels: {
                tabAccount: 'App.labels.account',
                tabDelegations: 'App.labels.myVotes',
                tabValidators: 'App.labels.validators',
                tabTransactions: 'App.labels.transactions'
            },
            actionScreenLabels: {},
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
        displayName: 'CELO',
        affiliateBanners: {
            account: AffiliateBannerType.LEDGER_NANO_X
        },
        fetchAccountStatsSec: 5
    },
    networks: {
        testNet: 44787,
        mainNet: 42220
    },
    defaultOrder: 1,
    amountToKeepInAccount: new BigNumber(0)
};

export enum Contracts {
    LOCKED_GOLD = 'LOCKED_GOLD',
    ELECTION = 'ELECTION',
    ACCOUNTS = 'ACCOUNTS'
}
