import { IBlockchainConfig, DerivationType } from '../types';
import { BigNumber } from 'bignumber.js';
import { TokenType } from '../types/token';

export const config: IBlockchainConfig = {
    derivationPath: `m/44'/60'/0'/0`,
    derivationType: DerivationType.HD_KEY,
    coin: 'ETH',
    defaultUnit: 'WEI',
    tokens: {
        ETH: {
            name: 'Ethereum',
            symbol: 'ETH',
            logo: {
                uri:
                    'https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/icon/eth.png'
            }, // require('../../../assets/images/png/eth.png'),
            order: 0,
            active: true,
            decimals: 18,
            uiDecimals: 4,
            type: TokenType.NATIVE,
            units: {
                WEI: new BigNumber(1),
                GWEI: new BigNumber(Math.pow(10, 9)),
                ETH: new BigNumber(Math.pow(10, 18))
            }
        }
    },
    feeOptions: {
        gasPriceToken: 'ETH',
        defaults: {
            gasPrice: new BigNumber(20000000000),
            gasLimit: new BigNumber(21000),
            gasPricePresets: {
                cheap: new BigNumber(2000000000),
                standard: new BigNumber(20000000000),
                fast: new BigNumber(40000000000),
                fastest: new BigNumber(120000000000)
            }
        },
        ui: {
            availableTokenTypes: [TokenType.ERC20],
            feeComponent: 'FeePresets',
            feeComponentAdvanced: 'GasFeeAdvanced',
            gasPriceUnit: 'GWEI',
            defaultPreset: 'standard'
        }
    },
    ui: {
        addressDisplay: 'stripped'
    }
};
