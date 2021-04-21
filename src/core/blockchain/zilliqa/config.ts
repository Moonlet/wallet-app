import { Platform } from 'react-native';
import { BigNumber } from 'bignumber.js';

import { IBlockchainConfig, DerivationType, BlockchainNameService } from '../types';
import { TokenType, TokenScreenComponentType, PosBasicActionType } from '../types/token';
import ZilIcon from '../../../assets/icons/blockchains/zil.svg';
import { ITokenConfigState } from '../../../redux/tokens/state';
import { IconValues } from '../../../components/icon/values';
import { AffiliateBannerType } from '../../../components/affiliate-banner/types';
import { AccountType } from '../../../redux/wallets/state';

import { XSGD_MAINNET } from './tokens/xsgd';
import { GZIL_MAINNET, GZIL_TESTNET } from './tokens/gzil';
import { PORT_MAINNET } from './tokens/port';
import { ZWAP_MAINNET } from './tokens/zwap';
import { BARTER_MAINNET } from './tokens/barter';
import { BOLT_MAINNET } from './tokens/bolt';
import { CARB_MAINNET } from './tokens/carb';
import { KKZ_MAINNET } from './tokens/kkz';
import { REDC_MAINNET } from './tokens/redc';
import { SERGS_MAINNET } from './tokens/sergs';
import { SHRK_MAINNET } from './tokens/shrk';
import { ZCH_MAINNET } from './tokens/zch';
import { ZLF_MAINNET } from './tokens/zlf';
import { ZLP_MAINNET } from './tokens/zlp';
import { ZYF_MAINNET } from './tokens/zyf';
import { ZYRO_MAINNET } from './tokens/zyro';

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
        decimals: 4,
        tokenScreenComponent: Platform.select({
            default: TokenScreenComponentType.DELEGATE,
            web: TokenScreenComponentType.DEFAULT
        })
    },
    type: TokenType.NATIVE,
    units: {
        QA: new BigNumber(1),
        LI: new BigNumber(Math.pow(10, 6)),
        ZIL: new BigNumber(Math.pow(10, 12))
    }
};

const accountCTA = {
    mainCta: {
        title: 'App.labels.stakeNow',
        iconName: IconValues.VOTE,
        navigateTo: {
            screen: 'SmartScreen',
            params: {
                context: {
                    screen: 'StakeNow',
                    step: 'StakeSelectValidator',
                    key: 'stake-now-select-validator'
                },
                navigationOptions: {
                    title: 'Stake now'
                },
                newFlow: true
            }
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
            title: 'App.labels.switchNode',
            iconName: IconValues.REVOTE,
            navigateTo: {
                screen: 'SmartScreen',
                params: {
                    context: {
                        screen: 'SwitchNode',
                        step: 'SwitchNodeSelectNode',
                        key: 'switch-node-select-node'
                    },
                    newFlow: true
                }
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
    autoAddedHiddenTokensSymbols: {
        '1': {
            PORT: PORT_MAINNET,
            ZWAP: ZWAP_MAINNET,
            ZLP: ZLP_MAINNET,
            BARTER: BARTER_MAINNET,
            BOLT: BOLT_MAINNET,
            REDC: REDC_MAINNET,
            SERGS: SERGS_MAINNET,
            SHRK: SHRK_MAINNET,
            KKZ: KKZ_MAINNET,
            ZCH: ZCH_MAINNET,
            ZLF: ZLF_MAINNET,
            ZYF: ZYF_MAINNET,
            ZYRO: ZYRO_MAINNET,
            CARB: CARB_MAINNET
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
                [TokenType.ZRC2]: new BigNumber(5000)
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
            maximumNumberOfValidators: 9999 // TBD
        },
        token: {
            labels: {
                tabAccount: 'App.labels.account',
                tabDelegations: 'App.labels.myStakes',
                tabValidators: 'App.labels.validators',
                tabTransactions: 'App.labels.transactions'
            },
            actionScreenLabels: {
                unstake: 'Validator.unstakeScreenMessageZil',
                redelegate: 'Validator.restakeScreenMessageZil'
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
        },
        fetchAccountStatsSec: 5
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
    ],
    amountToKeepInAccount: {
        [AccountType.DEFAULT]: new BigNumber(10).pow(13).multipliedBy(3) // 30 ZIL
    }
};

export enum Contracts {
    STAKING = 'STAKING',
    ZILSWAP = 'ZILSWAP',
    MOONLETSWAP = 'MOONLETSWAP',
    TOKEN_CONTRACT = 'TOKEN_CONTRACT'
}
