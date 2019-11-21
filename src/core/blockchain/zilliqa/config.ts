import { IBlockchainConfig } from '../types';
import { BigNumber } from 'bignumber.js';

export const config: IBlockchainConfig = {
    derivationPath: `m/44'/313'/0'/0`,
    coin: 'ZIL',
    defaultUnit: 'QA',
    units: {
        QA: new BigNumber(1),
        LI: new BigNumber(Math.pow(10, 6)),
        ZIL: new BigNumber(Math.pow(10, 12))
    },
    decimals: 3,
    feeOptions: {
        defaults: {
            gasPrice: new BigNumber(1000),
            gasLimit: new BigNumber(1)
        },
        ui: {
            feeComponent: 'FeeTotal',
            feeComponentAdvanced: 'FeeAdvanced',
            gasPriceUnit: 'LI'
        }
    }
};
