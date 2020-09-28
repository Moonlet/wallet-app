import { IBlockchainConfig, DerivationType, BlockchainNameService } from '../types';
import { BigNumber } from 'bignumber.js';
import { TokenType, TokenScreenComponentType, PosBasicActionType } from '../types/token';
import ZilIcon from '../../../assets/icons/blockchains/zil.svg';
import { ITokenConfigState } from '../../../redux/tokens/state';
import { XSGD_MAINNET } from './tokens/xsgd';
import { IconValues } from '../../../components/icon/values';
import { GZIL_MAINNET, GZIL_TESTNET } from './tokens/gzil';
import { AffiliateBannerType } from '../../../components/affiliate-banner/types';

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
        tokenScreenComponent: TokenScreenComponentType.DELEGATE
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
        iconName: IconValues.VOTE,
        navigateTo: {
            screen: 'PosQuickDelegate',
            params: { actionText: 'App.labels.quickStake' }
        }
    }
};

const validatorCTA = {
    mainCta: {
        title: 'App.labels.stake',
        iconName: IconValues.VOTE,
        navigateTo: {
            screen: 'PosDelegate',
            params: { actionText: 'App.labels.stake' }
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
                    basicAction: PosBasicActionType.CLAIM_REWARD_NO_INPUT,
                    unlockDays: '3 days'
                }
            }
        },
        {
            title: 'App.labels.restake',
            iconName: IconValues.REVOTE,
            navigateTo: {
                screen: 'PosRedelegate',
                params: { actionText: 'App.labels.restake' }
            }
        },
        {
            title: 'App.labels.unstake',
            iconName: IconValues.UNVOTE,
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
            gZIL: GZIL_MAINNET,
            XSGD: XSGD_MAINNET
        },
        '333': {
            gZIL: GZIL_TESTNET
        }
    },
    tokens: {
        ZIL: ZIL_NATIVE
    },
    feeOptions: {
        gasPriceToken: 'ZIL',
        defaults: {
            gasPrice: new BigNumber(2000000000),
            gasLimit: {
                [TokenType.NATIVE]: new BigNumber(1),
                [TokenType.ZRC2]: new BigNumber(25000)
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
            totalLabel: 'Validator.totalStakes',
            amountCardLabel: 'Validator.myStake',
            maximumNumberOfValidators: 5 // TBD
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
        displayName: 'ZIL',
        affiliateBanners: {
            account: AffiliateBannerType.UNSTOPPABLE_DOMAINS
        }
    },
    networks: {
        testNet: 333,
        mainNet: 1
    },
    defaultOrder: 0,
    nameServices: [
        {
            tld: 'zil',
            service: BlockchainNameService.ZNS,
            record: ['crypto.ZIL.address']
        },
        {
            tld: 'crypto',
            service: BlockchainNameService.CNS,
            record: ['crypto.ZIL.address']
        }
    ]
};

export enum Contracts {
    STAKING = 'STAKING'
}
