import { IBlockchainConfig, DerivationType } from '../types';
import { BigNumber } from 'bignumber.js';
import { TokenType } from '../types/token';

export const config: IBlockchainConfig = {
    derivationPath: `m/44'/313'/0'/0`,
    derivationType: DerivationType.HD_KEY,
    coin: 'ZIL',
    defaultUnit: 'QA',
    tokens: {
        ZIL: {
            name: 'Zilliqa',
            symbol: 'ZIL',
            logo: {
                uri:
                    'https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/icon/zil.png'
            }, // require('../../../assets/images/png/zil.png'),
            order: 0,
            active: true,
            decimals: 12,
            uiDecimals: 3,
            type: TokenType.NATIVE,
            units: {
                QA: new BigNumber(1),
                LI: new BigNumber(Math.pow(10, 6)),
                ZIL: new BigNumber(Math.pow(10, 12))
            }
        }
    },
    feeOptions: {
        gasPriceToken: 'ZIL',
        defaults: {
            gasPrice: new BigNumber(1000000000),
            gasLimit: new BigNumber(1)
        },
        ui: {
            availableTokenTypes: [],
            feeComponent: 'FeeTotal',
            feeComponentAdvanced: 'GasFeeAdvanced',
            gasPriceUnit: 'LI'
        }
    },
    ui: {
        addressDisplay: 'stripped',
        enableTokenManagement: true,
        enableAccountCreation: false,
        maxAccountsNumber: 5
    },
    networks: {
        testNet: 333,
        mainNet: 1
    },
    defaultOrder: 0
};
