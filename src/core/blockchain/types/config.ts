import { BigNumber } from 'bignumber.js';
import { ITokenConfig, TokenType } from './token';

export enum DerivationType {
    HD_KEY = 'HD_KEY',
    HD_KEY_ED25519 = 'HD_KEY_ED25519'
}
export interface IBlockchainConfig {
    derivationPath: string;
    derivationType: DerivationType;
    coin: string;
    defaultUnit: string;
    tokens: {
        [symbol: string]: ITokenConfig;
    };
    feeOptions: {
        gasPriceToken: string;
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
            availableTokenTypes: TokenType[];
            feeComponent: 'FeeTotal' | 'FeePresets';
            feeComponentAdvanced?: 'GasFeeAdvanced';
            gasPriceUnit: string;
            defaultPreset?: 'cheap' | 'standard' | 'fast' | 'fastest';
        };
    };
}
