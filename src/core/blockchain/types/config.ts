import { BigNumber } from 'bignumber.js';

export interface IBlockchainConfig {
    derivationPath: string;
    coin: string;
    defaultUnit: string;
    units: {
        [unit: string]: BigNumber;
    };
    decimals: number;
    feeOptions: {
        defaults: {
            gasPrice: BigNumber;
            gasLimit: BigNumber;
            gasPricePresets?: {
                cheap: BigNumber;
                standard: BigNumber;
                fast: BigNumber;
                fastest: BigNumber;
            };
        };
        ui: {
            feeComponent: 'FeeTotal' | 'FeePresets';
            feeComponentAdvanced?: 'FeeAdvanced';
            gasPriceUnit: string;
            defaultPreset?: 'cheap' | 'standard' | 'fast' | 'fastest';
        };
    };
}
