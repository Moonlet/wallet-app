import { IBlockchainConfig, DerivationType } from '../types';
import { BigNumber } from 'bignumber.js';
import { TokenType, TokenScreenComponentType, PosBasicActionType } from '../types/token';
import NearIcon from '../../../assets/icons/blockchains/near.svg';
import { ITokenConfigState } from '../../../redux/tokens/state';
import { IconValues } from '../../../components/icon/values';

export const NEAR_NATIVE: ITokenConfigState = {
    name: 'Near',
    symbol: 'NEAR',
    icon: {
        iconComponent: NearIcon
    },
    removable: false,
    defaultOrder: 0,
    decimals: 24,
    ui: {
        decimals: 4,
        tokenScreenComponent: TokenScreenComponentType.DELEGATE
    },
    type: TokenType.NATIVE,
    units: {
        YNEAR: new BigNumber(1),
        NEAR: new BigNumber(Math.pow(10, 24))
    }
};

const accountCTA = {
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
    derivationPath: `m/44'/397'`,
    derivationType: DerivationType.HD_KEY_ED25519,
    coin: 'NEAR',
    defaultUnit: 'YNEAR',
    iconComponent: NearIcon,
    droppedTxBlocksThreshold: 10,
    autoAddedTokensSymbols: {},
    tokens: {
        NEAR: NEAR_NATIVE
    },
    feeOptions: {
        gasPriceToken: 'NEAR',
        defaults: {
            gasPrice: new BigNumber('10000'),
            gasLimit: {
                [TokenType.NATIVE]: new BigNumber('937144600000')
            }
        },
        ui: {
            availableTokenTypes: [],
            feeComponent: 'FeeTotal',
            feeComponentAdvanced: undefined,
            gasPriceUnit: 'YNEAR'
        }
    },
    ui: {
        validator: {
            totalLabel: 'Validator.totalStakes',
            amountCardLabel: 'App.labels.staked'
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
        enableTokenManagement: false,
        enableAccountCreation: true,
        maxAccountsNumber: 5,
        displayName: 'NEAR'
    },
    networks: {
        mainNet: 'mainnet',
        testNet: 'testnet'
    },
    defaultOrder: 2
};
