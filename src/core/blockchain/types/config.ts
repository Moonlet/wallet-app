import { BigNumber } from 'bignumber.js';

export interface IBlockchainConfig {
    derivationPath: string;
    coin: string;
    defaultUnit: string;
    units: {
        [unit: string]: BigNumber;
    };
    decimals: number;
    feeOptions?: {
        defaults: {};
        ui: {
            feeComponent: 'FeeTotal' | 'FeePresets';
            feeComponentAdvanced?: '';
        };
    };
}
