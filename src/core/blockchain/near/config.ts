import { IBlockchainConfig, DerivationType } from '../types';
import { BigNumber } from 'bignumber.js';
import { TokenType } from '../types/token';

export const config: IBlockchainConfig = {
    derivationPath: `m/44'/397'`,
    derivationType: DerivationType.HD_KEY_ED25519,
    coin: 'NEAR',
    defaultUnit: 'YNEAR',
    tokens: {
        NEAR: {
            name: 'Near',
            symbol: 'NEAR',
            logo: {
                uri:
                    'https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/icon/generic.png'
            },
            order: 0,
            active: true,
            decimals: 24,
            uiDecimals: 4,
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
            gasPrice: new BigNumber('937144500000'),
            gasLimit: new BigNumber('1')
        },
        ui: {
            availableTokenTypes: [],
            feeComponent: 'FeeTotal',
            feeComponentAdvanced: undefined,
            gasPriceUnit: 'YNEAR'
        }
    }
};
