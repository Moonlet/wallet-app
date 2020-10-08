import { IBlockchainConfig, DerivationType } from '../types';
import { BigNumber } from 'bignumber.js';
import { TokenType, TokenScreenComponentType, PosBasicActionType } from '../types/token';
import CosmosIcon from '../../../assets/icons/blockchains/cosmos.svg';
import { ITokenConfigState } from '../../../redux/tokens/state';
import { IconValues } from '../../../components/icon/values';
import { AffiliateBannerType } from '../../../components/affiliate-banner/types';

export const ATOM_NATIVE: ITokenConfigState = {
    name: 'Atom',
    symbol: 'ATOM',
    icon: {
        iconComponent: CosmosIcon
    },
    removable: false,
    defaultOrder: 0,
    decimals: 6,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DELEGATE
    },
    type: TokenType.NATIVE,
    units: {
        UATOM: new BigNumber(1),
        ATOM: new BigNumber(Math.pow(10, 6))
    },
    symbolMap: {
        'gaia-13007': 'umuon'
    }
};

export const accountCTA = {
    mainCta: {
        title: 'App.labels.quickDelegate',
        iconName: IconValues.VOTE,
        navigateTo: {
            screen: 'PosQuickDelegate',
            params: { actionText: 'App.labels.delegate' }
        }
    }
};

const validatorCTA = {
    mainCta: {
        title: 'App.labels.delegate',
        iconName: IconValues.VOTE,
        navigateTo: {
            screen: 'PosDelegate',
            params: { actionText: 'App.labels.delegate' }
        }
    },
    otherCtas: [
        {
            title: 'App.labels.claimReward',
            iconName: IconValues.CLAIM_REWARD,
            navigateTo: {
                screen: 'PosBasicAction',
                params: {
                    actionText: 'App.labels.claimReward',
                    basicAction: PosBasicActionType.CLAIM_REWARD
                }
            }
        },
        {
            title: 'App.labels.reinvest',
            iconName: IconValues.REINVEST,
            navigateTo: {
                screen: 'PosBasicAction',
                params: {
                    actionText: 'App.labels.reinvest',
                    basicAction: PosBasicActionType.REINVEST
                }
            }
        },
        {
            title: 'App.labels.redelegate',
            iconName: IconValues.REVOTE,
            navigateTo: {
                screen: 'PosRedelegate',
                params: { actionText: 'App.labels.redelegate' }
            }
        },
        {
            title: 'App.labels.undelegate',
            iconName: IconValues.UNVOTE,
            navigateTo: {
                screen: 'PosBasicAction',
                params: {
                    actionText: 'App.labels.undelegate',
                    basicAction: PosBasicActionType.UNDELEGATE,
                    unlockDays: '21 days'
                }
            }
        }
    ]
};

export const config: IBlockchainConfig = {
    derivationPath: `m/44'/118'/0'/0`,
    derivationType: DerivationType.HD_KEY,
    coin: 'ATOM',
    defaultUnit: 'UATOM',
    iconComponent: CosmosIcon,
    droppedTxBlocksThreshold: 10,
    autoAddedTokensSymbols: {},
    tokens: {
        ATOM: ATOM_NATIVE
    },
    feeOptions: {
        gasPriceToken: 'ATOM',
        defaults: {
            gasPrice: new BigNumber(1),
            gasLimit: {
                [TokenType.NATIVE]: new BigNumber(100000)
            },
            gasPricePresets: {
                low: new BigNumber(0.0025),
                average: new BigNumber(0.025)
            }
        },
        ui: {
            availableTokenTypes: [],
            feeComponent: 'FeePresets',
            gasPriceUnit: 'UATOM',
            defaultPreset: 'low'
        }
    },
    ui: {
        validator: {
            totalLabel: 'Validator.totalDelegated',
            amountCardLabel: 'Validator.delegation'
        },
        token: {
            labels: {
                tabAccount: 'App.labels.account',
                tabDelegations: 'App.labels.delegations',
                tabValidators: 'App.labels.validators',
                tabTransactions: 'App.labels.transactions'
            },
            actionScreenLabels: {},
            sendStepLabels: [
                'Validator.selectValidator',
                'App.labels.enterAmount',
                'Validator.confirmStake'
            ],
            accountCTA,
            delegationCTA: {
                mainCta: accountCTA.mainCta
            },
            validatorCTA
        },
        addressDisplay: 'stripped',
        enableTokenManagement: false,
        enableAccountCreation: false,
        maxAccountsNumber: 5,
        extraFields: ['Memo'],
        displayName: 'COSMOS',
        affiliateBanners: {
            account: AffiliateBannerType.LEDGER_NANO_X
        },
        fetchAccountStatsSec: 5
    },
    networks: {
        testNet: 'gaia-13007',
        mainNet: 'cosmoshub-3'
    },
    defaultOrder: 3
};
