import { IBlockchainConfig, DerivationType } from '../types';
import { BigNumber } from 'bignumber.js';
import { TokenType, TokenScreenComponentType } from '../types/token';
import NearIcon from '../../../assets/icons/blockchains/near.svg';
import { ITokenConfigState } from '../../../redux/tokens/state';

export const NEAR_NATIVE: ITokenConfigState = {
    name: 'Near',
    symbol: 'NEAR',
    icon: {
        iconComponent: NearIcon
    },
    defaultOrder: 0,
    decimals: 24,
    ui: {
        decimals: 4,
        tokenScreenComponent: TokenScreenComponentType.DEFAULT
    },
    type: TokenType.NATIVE,
    units: {
        YNEAR: new BigNumber(1),
        NEAR: new BigNumber(Math.pow(10, 24))
    }
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
        enableTokenManagement: false,
        enableAccountCreation: true,
        maxAccountsNumber: 5,
        blockchainDisplay: 'NEAR'
    },
    networks: {
        testNet: 'testnet'
    },
    defaultOrder: 2
};
