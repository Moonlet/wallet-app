import { IBlockchainConfig, DerivationType } from '../types';
import { BigNumber } from 'bignumber.js';
import { TokenType, TokenScreenComponentType } from '../types/token';
import NearIcon from '../../../assets/icons/blockchains/near.svg';

export const config: IBlockchainConfig = {
    derivationPath: `m/44'/397'`,
    derivationType: DerivationType.HD_KEY_ED25519,
    coin: 'NEAR',
    defaultUnit: 'YNEAR',
    iconComponent: NearIcon,
    tokens: {
        NEAR: {
            name: 'Near',
            symbol: 'NEAR',
            icon: {
                iconComponent: NearIcon
            },
            order: 0,
            active: true,
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
        }
    },
    feeOptions: {
        gasPriceToken: 'NEAR',
        defaults: {
            gasPrice: new BigNumber('10000'),
            gasLimit: new BigNumber('937144600000')
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
        maxAccountsNumber: 5
    },
    networks: {
        testNet: 'testnet'
    },
    defaultOrder: 2
};
