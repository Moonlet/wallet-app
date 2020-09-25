import { ITokenIcon, TokenType, TokenScreenComponentType } from '../../core/blockchain/types/token';
import BigNumber from 'bignumber.js';
import { ChainIdType } from '../../core/blockchain/types';

export interface ITokensConfigState {
    [blockchain: string]: {
        [chainId: string]: {
            [symbol: string]: ITokenConfigState;
        };
    };
}

export interface ITokenConfigState {
    name: string;
    chainId?: ChainIdType;
    symbol: string;
    icon?: ITokenIcon;
    type: TokenType;
    removable: boolean;
    contractAddress?: string;
    decimals: number;
    defaultOrder?: number;
    ui: {
        decimals: number;
        tokenScreenComponent: TokenScreenComponentType;
    };
    units?: {
        [unit: string]: BigNumber;
    };
    symbolMap?: {
        [testnet: string]: string;
    };
}
