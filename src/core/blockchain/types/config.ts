import { BigNumber } from 'bignumber.js';
import { ITokenConfig, TokenType } from './token';
import { ChainIdType } from '.';

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
                cheap?: BigNumber;
                standard?: BigNumber;
                fast?: BigNumber;
                fastest?: BigNumber;
                low?: BigNumber;
                average?: BigNumber;
            };
        };
        ui: {
            availableTokenTypes: TokenType[];
            feeComponent: 'FeeTotal' | 'FeePresets';
            feeComponentAdvanced?: 'GasFeeAdvanced';
            gasPriceUnit: string;
            defaultPreset?: 'cheap' | 'standard' | 'fast' | 'fastest' | 'low' | 'average';
        };
    };
    ui: {
        addressDisplay?: 'stripped';
        enableTokenManagement: boolean;
        enableAccountCreation: boolean;
        maxAccountsNumber: number;
        extraFields?: string[];
    };
    networks: {
        testNet: ChainIdType;
        mainNet?: ChainIdType;
    };
    defaultOrder: number;
}
