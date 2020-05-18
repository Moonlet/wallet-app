import { BigNumber } from 'bignumber.js';
import { TokenType, IButtonCTA } from './token';
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
    droppedTxBlocksThreshold: number;
    autoAddedTokensSymbols: {
        [chainId: string]: {
            [symbol: string]: ITokenConfigState;
        };
    };
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
        validator?: {
            totalLabel: string;
            amountCardLabel: string;
        };
        token?: {
            labels: {
                tabAccount?: string;
                tabDelegations?: string;
                tabValidators?: string;
                tabTransactions?: string;
            };
            accountCTA: {
                mainCta: IButtonCTA;
            };
            delegationCTA: {
                mainCta: IButtonCTA;
            };
            validatorCTA: {
                mainCta: IButtonCTA;
                otherCtas: IButtonCTA[];
            };
        };
        addressDisplay?: 'stripped';
        enableTokenManagement: boolean;
        enableAccountCreation: boolean;
        maxAccountsNumber: number;
        extraFields?: string[];
        displayName: string;
    };
    networks: {
        testNet: ChainIdType;
        mainNet?: ChainIdType;
    };
    defaultOrder: number;
}
