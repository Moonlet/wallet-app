import { IBlockchainConfig, DerivationType } from '../types';
import { BigNumber } from 'bignumber.js';
import { TokenType, TokenScreenComponentType, PosBasicActionType } from '../types/token';
import ZilIcon from '../../../assets/icons/blockchains/zil.svg';
import { ITokenConfigState } from '../../../redux/tokens/state';
import { XSGD_MAINNET } from './tokens/xsgd';

export const ZIL_NATIVE: ITokenConfigState = {
    name: 'Zilliqa',
    symbol: 'ZIL',
    icon: {
        iconComponent: ZilIcon
    },
    defaultOrder: 0,
    removable: false,
    decimals: 12,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.NATIVE,
    units: {
        QA: new BigNumber(1),
        LI: new BigNumber(Math.pow(10, 6)),
        ZIL: new BigNumber(Math.pow(10, 12))
    }
};

export const accountCTA = {
    mainCta: {
        title: 'App.labels.quickStake',
        iconName: 'vote',
        navigateTo: {
            screen: 'PosQuickDelegate',
            params: { actionText: 'App.labels.quickStake' }
        }
    }
};

const validatorCTA = {
    mainCta: {
        title: 'App.labels.stake',
        iconName: 'vote',
        navigateTo: {
            screen: 'PosDelegate',
            params: { actionText: 'App.labels.stake' }
        }
    },
    otherCtas: [
        {
            title: 'App.labels.claimReward',
            iconName: 'claim-reward',
            navigateTo: {
                screen: 'PosBasicAction',
                params: {
                    actionText: 'App.labels.claimReward',
                    basicAction: PosBasicActionType.CLAIM_REWARD,
                    unlockDays: 3
                }
            }
        },
        {
            title: 'App.labels.restake',
            iconName: 'revote',
            navigateTo: {
                screen: 'PosRedelegate',
                params: { actionText: 'App.labels.restake' }
            }
        },
        {
            title: 'App.labels.unstake',
            iconName: 'unvote',
            navigateTo: {
                screen: 'PosBasicAction',
                params: {
                    actionText: 'App.labels.unstake',
                    basicAction: PosBasicActionType.UNSTAKE
                }
            }
        }
    ]
};

export const config: IBlockchainConfig = {
    derivationPath: `m/44'/313'/0'/0`,
    derivationType: DerivationType.HD_KEY,
    coin: 'ZIL',
    defaultUnit: 'QA',
    droppedTxBlocksThreshold: 10,
    iconComponent: ZilIcon,
    autoAddedTokensSymbols: {
        '1': {
            XSGD: XSGD_MAINNET
        }
    },
    tokens: {
        ZIL: ZIL_NATIVE
    },
    feeOptions: {
        gasPriceToken: 'ZIL',
        defaults: {
            gasPrice: new BigNumber(1000000000),
            gasLimit: {
                [TokenType.NATIVE]: new BigNumber(1),
                [TokenType.ZRC2]: new BigNumber(10000)
            }
        },
        ui: {
            availableTokenTypes: [],
            feeComponent: 'FeeTotal',
            feeComponentAdvanced: 'GasFeeAdvanced',
            gasPriceUnit: 'LI'
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
                tabDelegations: 'App.labels.myStakes',
                tabValidators: 'App.labels.validators',
                tabTransactions: 'App.labels.transactions'
            },
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
        enableTokenManagement: true,
        enableAccountCreation: false,
        maxAccountsNumber: 5,
        displayName: 'ZIL'
    },
    networks: {
        testNet: 333,
        mainNet: 1
    },
    defaultOrder: 0
};
