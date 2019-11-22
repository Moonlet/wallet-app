import { IBlockchainConfig } from '../types';
import { BigNumber } from 'bignumber.js';

export const config: IBlockchainConfig = {
    derivationPath: `m/44'/60'/0'/0`,
    coin: 'ETH',
    defaultUnit: 'WEI',
    units: {
        WEI: new BigNumber(1),
        GWEI: new BigNumber(Math.pow(10, 9)),
        ETH: new BigNumber(Math.pow(10, 18))
    },
    decimals: 4,
    feeOptions: {
        defaults: {
            gasPrice: new BigNumber(20000000000),
            gasLimit: new BigNumber(21000000000000),
            gasPricePresets: {
                cheap: new BigNumber(2000000000),
                standard: new BigNumber(20000000000),
                fast: new BigNumber(40000000000),
                fastest: new BigNumber(120000000000)
            }
        },
        ui: {
            feeComponent: 'FeePresets',
            feeComponentAdvanced: 'FeeAdvanced',
            gasPriceUnit: 'GWEI',
            defaultPreset: 'standard'
        }
    }
};
