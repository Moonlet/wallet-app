import { IBlockchainConfig, DerivationType } from '../types';
import { BigNumber } from 'bignumber.js';
import { TokenType } from '../types/token';
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
        image: '',
        style: ''
    },
    otherCta: [
        {
            title: 'App.labels.quickVote',
            image: '',
            style: ''
        },
        {
            title: 'App.labels.quickVote',
            image: '',
            style: ''
        }
    ]
};

const validatorCTA = {
    mainCta: {
        title: 'App.labels.vote',
        image: '',
        style: ''
    },
    otherCta: [
        {
            title: 'App.labels.revote',
            image: '',
            style: ''
        },
        {
            title: 'App.labels.unvote',
            image: '',
            style: ''
        },
        {
            title: 'App.labels.unlock',
            image: '',
            style: ''
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
        token: {
            labels: {
                tabAccount: 'App.labels.account',
                tabDelegations: 'App.labels.myVotes',
                tabValidators: 'App.labels.validators',
                tabTransactions: 'App.labels.transactions'
            },
            accountCTA,
            delegationCTA: {
                mainCta: accountCTA.mainCta,
                otherCta: []
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
