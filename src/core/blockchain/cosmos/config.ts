import { IBlockchainConfig, DerivationType } from '../types';
import { BigNumber } from 'bignumber.js';
import { TokenType, TokenScreenComponentType } from '../types/token';
import CosmosIcon from '../../../assets/icons/blockchains/cosmos.svg';
import { ITokenConfigState } from '../../../redux/tokens/state';

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
        tokenScreenComponent: TokenScreenComponentType.DELEGATE // TODO: DELEGATE is in progress
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
        iconName: '',
        navigateTo: { screen: undefined, params: undefined }
    },
    otherCta: [
        {
            title: 'App.labels.quickDelegate',
            iconName: '',
            navigateTo: { screen: undefined, params: undefined }
        },
        {
            title: 'App.labels.quickDelegate',
            iconName: '',
            navigateTo: { screen: undefined, params: undefined }
        }
    ]
};

const validatorCTA = {
    mainCta: {
        title: 'App.labels.delegate',
        iconName: '',
        navigateTo: { screen: undefined, params: undefined }
    },
    otherCta: [
        {
            title: 'App.labels.claimReward',
            iconName: '',
            navigateTo: { screen: undefined, params: undefined }
        },
        {
            title: 'App.labels.reinvest',
            iconName: '',
            navigateTo: { screen: undefined, params: undefined }
        },
        {
            title: 'App.labels.redelegate',
            iconName: '',
            navigateTo: { screen: undefined, params: undefined }
        },
        {
            title: 'App.labels.undelegate',
            iconName: '',
            navigateTo: { screen: undefined, params: undefined }
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
        token: {
            labels: {
                tabAccount: 'App.labels.account',
                tabDelegations: 'App.labels.delegations',
                tabValidators: 'App.labels.validators',
                tabTransactions: 'App.labels.transactions'
            },
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
        displayName: 'COSMOS'
    },
    networks: {
        testNet: 'gaia-13007',
        mainNet: 'cosmoshub-3'
    },
    defaultOrder: 3
};
