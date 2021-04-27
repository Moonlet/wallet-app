import { IBlockchainConfig, DerivationType } from '../types';
import { BigNumber } from 'bignumber.js';
import { TokenType, TokenScreenComponentType } from '../types/token';
import SolIcon from '../../../assets/icons/blockchains/sol.svg';
import { ITokenConfigState } from '../../../redux/tokens/state';
import { AffiliateBannerType } from '../../../components/affiliate-banner/types';
import { AccountType } from '../../../redux/wallets/state';
import { IconValues } from '../../../components/icon/values';

export const SOL_NATIVE: ITokenConfigState = {
    name: 'Solana',
    symbol: 'SOL',
    icon: {
        iconComponent: SolIcon
    },
    defaultOrder: 0,
    decimals: 9,
    removable: false,
    ui: {
        decimals: 3,
        tokenScreenComponent: TokenScreenComponentType.DELEGATE
    },
    type: TokenType.NATIVE,
    units: {
        NA: new BigNumber(1),
        LA: new BigNumber(Math.pow(10, 9)),
        SOL: new BigNumber(Math.pow(10, 9))
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
            screen: 'SmartScreen',
            params: {
                context: {
                    screen: 'StakeNow',
                    step: 'SelectStakeAccount',
                    key: 'select-stake-account'
                },
                navigationOptions: {
                    title: 'Stake now'
                },
                newFlow: true
            }
        }
    },
    otherCtas: [
        {
            title: 'App.labels.unstake',
            iconName: IconValues.UNVOTE,
            navigateTo: {
                screen: 'SmartScreen',
                params: {
                    context: {
                        screen: 'StakingAccount',
                        key: 'solana-staking-account'
                    },
                    navigationOptions: {
                        title: 'Staking accounts'
                    },
                    newFlow: true
                }
            }
        }
    ]
};

export const config: IBlockchainConfig = {
    derivationPath: `m/44'/501'`,
    derivationType: DerivationType.HD_KEY_ED25519,
    coin: 'SOL',
    defaultUnit: 'NA',
    droppedTxBlocksThreshold: 360,
    iconComponent: SolIcon,
    autoAddedTokensSymbols: {},
    tokens: {
        SOL: SOL_NATIVE
    },
    feeOptions: {
        gasPriceToken: 'SOL',
        defaults: {
            gasPrice: new BigNumber(10000000),
            gasLimit: {
                [TokenType.NATIVE]: new BigNumber(1)
            }
        },
        ui: {
            availableTokenTypes: [],
            feeComponent: 'FeeTotal',
            feeComponentAdvanced: 'GasFeeAdvanced',
            gasPriceUnit: 'LA'
        }
    },
    ui: {
        validator: {
            totalLabel: 'Validator.totalStakes',
            amountCardLabel: 'App.labels.staked',
            maximumNumberOfValidators: 9999 // TBD
        },
        token: {
            labels: {
                tabAccount: 'App.labels.account',
                tabDelegations: 'App.labels.myStakes',
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
        enableTokenManagement: true,
        enableAccountCreation: false,
        maxAccountsNumber: 5,
        displayName: 'SOL',
        affiliateBanners: {
            account: AffiliateBannerType.LEDGER_NANO_X
        },
        fetchAccountStatsSec: 1
    },
    networks: {
        testNet: '3',
        mainNet: '1'
    },
    defaultOrder: 0,
    amountToKeepInAccount: {
        [AccountType.DEFAULT]: new BigNumber(10).pow(9).dividedBy(100), // 0.01 SOL
        [AccountType.ROOT]: new BigNumber(10).pow(9).dividedBy(100) // 0.01 SOL
    }
};

export enum Contracts {
    STAKING = 'STAKING'
}
