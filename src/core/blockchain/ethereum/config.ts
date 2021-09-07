import {
    IBlockchainConfig,
    DerivationType,
    BlockchainNameService,
    TypedTransaction
} from '../types';
import { BigNumber } from 'bignumber.js';
import { TokenType, TokenScreenComponentType, PosBasicActionType } from '../types/token';
import EthIcon from '../../../assets/icons/blockchains/eth.svg';
import { ITokenConfigState } from '../../../redux/tokens/state';
import { DAI_MAINNET } from './tokens/dai';
import { LINK_MAINNET } from './tokens/chainLink';
import { AffiliateBannerType } from '../../../components/affiliate-banner/types';
import { COMP_MAINNET } from './tokens/compoundFinance';
import { LEND_MAINNET } from './tokens/ethLend';
import { MKR_MAINNET } from './tokens/maker';
import { OMG_MAINNET } from './tokens/omgNetwork';
import { SNX_MAINNET } from './tokens/syntheticNetwork';
import { USDT_MAINNET } from './tokens/theter';
import { UNI_MAINNET } from './tokens/uniSwap';
import { USDC_MAINNET } from './tokens/usdCoin';
import { YFI_MAINNET } from './tokens/yearnFinance';
import { AccountType } from '../../../redux/wallets/state';
import { IDRT_MAINNET } from './tokens/idrt';
import { GRT_MAINNET, GRT_TESTNET } from './tokens/grt';
import { IconValues } from '../../../components/icon/values';

export const ETH_NATIVE: ITokenConfigState = {
    name: 'Ethereum',
    symbol: 'ETH',
    icon: {
        iconComponent: EthIcon
    },
    removable: false,
    defaultOrder: 0,
    decimals: 18,
    ui: {
        decimals: 4,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.NATIVE,
    units: {
        WEI: new BigNumber(1),
        GWEI: new BigNumber(Math.pow(10, 9)),
        ETH: new BigNumber(Math.pow(10, 18))
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
                    step: 'StakeToMoonlet',
                    key: 'stake-to-moonlet'
                },
                navigationOptions: {
                    title: 'Stake now',
                    headerStyle: {
                        backgroundColor: '#005067',
                        borderBottomWidth: 0,
                        shadowColor: 'transparent'
                    }
                },
                background: {
                    gradient: ['#005067', '#061529']
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
    derivationPath: `m/44'/60'/0'/0`,
    derivationType: DerivationType.HD_KEY,
    coin: 'ETH',
    defaultUnit: 'WEI',
    iconComponent: EthIcon,
    droppedTxBlocksThreshold: 50,
    autoAddedTokensSymbols: {
        '1': {
            DAI: DAI_MAINNET,
            USDT: USDT_MAINNET,
            LINK: LINK_MAINNET,
            USDC: USDC_MAINNET,
            LEND: LEND_MAINNET,
            UNI: UNI_MAINNET,
            YFI: YFI_MAINNET,
            MKR: MKR_MAINNET,
            OMG: OMG_MAINNET,
            COMP: COMP_MAINNET,
            SNX: SNX_MAINNET,
            IDRT: IDRT_MAINNET,
            GRT: GRT_MAINNET
        },
        '4': {
            GRT: GRT_TESTNET
        }
    },
    tokens: {
        ETH: ETH_NATIVE
    },
    typedTransaction: {
        HD: TypedTransaction.TYPE_2,
        HW: TypedTransaction.TYPE_0
    },
    feeOptions: {
        gasPriceToken: 'ETH',
        defaults: {
            gasPrice: new BigNumber(20000000000),
            gasLimit: {
                [TokenType.NATIVE]: new BigNumber(21000),
                [TokenType.ERC20]: new BigNumber(300000)
            },
            gasPricePresets: {
                low: {
                    gasPrice: new BigNumber(20000000000),
                    maxFeePerGas: new BigNumber(20000000000),
                    maxPriorityFeePerGas: new BigNumber(20000000000)
                },
                medium: {
                    gasPrice: new BigNumber(40000000000),
                    maxFeePerGas: new BigNumber(40000000000),
                    maxPriorityFeePerGas: new BigNumber(40000000000)
                },
                high: {
                    gasPrice: new BigNumber(120000000000),
                    maxFeePerGas: new BigNumber(120000000000),
                    maxPriorityFeePerGas: new BigNumber(120000000000)
                }
            }
        },
        ui: {
            availableTokenTypes: [TokenType.ERC20],
            feeComponent: 'FeePresets',
            feeComponentAdvanced: {
                HD: 'Eip1559FeesAvanced',
                HW: 'GasFeeAdvanced'
            },

            gasPriceUnit: 'GWEI',
            defaultPreset: 'medium'
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
                // unstake: 'Validator.unstakeScreenMessageZil', // TODO change messages
                // redelegate: 'Validator.restakeScreenMessageZil'
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
        displayName: 'ETH',
        affiliateBanners: {
            account: AffiliateBannerType.UNSTOPPABLE_DOMAINS
        },
        fetchAccountStatsSec: 5
    },
    networks: {
        testNet: 4,
        mainNet: 1
    },
    defaultOrder: 1,
    nameServices: [
        {
            tld: /^(xyz|kred|art|luxe|eth)$/gi,
            service: BlockchainNameService.ENS
        },
        {
            tld: 'zil',
            service: BlockchainNameService.ZNS,
            record: ['crypto.ETH.address']
        },
        {
            tld: 'crypto',
            service: BlockchainNameService.CNS,
            record: ['crypto.ETH.address']
        }
    ],
    amountToKeepInAccount: {
        [AccountType.DEFAULT]: new BigNumber(0)
    }
};
