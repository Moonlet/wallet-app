import { BigNumber } from 'bignumber.js';
import { TokenType } from './token';
import { ChainIdType } from '.';
import { ITokenConfigState } from '../../../redux/tokens/state';

export enum DerivationType {
    HD_KEY = 'HD_KEY',
    HD_KEY_ED25519 = 'HD_KEY_ED25519'
}
export interface IBlockchainConfig {
    derivationPath: string;
    derivationType: DerivationType;
    coin: string;
    defaultUnit: string;
    iconComponent: React.ComponentType<any>;
    tokens: {
        [symbol: string]: ITokenConfigState;
    };
    feeOptions: {
        gasPriceToken: string;
        defaults: {
            gasPrice: BigNumber;
            gasLimit: {
                [tokenType: string]: BigNumber;
            };
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
        token?: {
            labels: {
                tabAccount?: string;
                tabDelegations?: string;
                tabValidators?: string;
                tabTransactions?: string;
            };
        };
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
