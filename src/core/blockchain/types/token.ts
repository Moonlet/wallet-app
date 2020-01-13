import BigNumber from 'bignumber.js';

export enum TokenType {
    NATIVE = 'NATIVE',
    ERC20 = 'ERC20'
}

export interface ITokenConfig {
    name: string;
    symbol: string;
    logo?: string;
    type: TokenType; // TokenType (Native, ERC20, ...)
    contractAddress?: string;
    decimals: number;
    uiDecimals: number;
    units?: {
        [unit: string]: BigNumber;
    };
    order: number;
    balance?: {
        value: BigNumber;
        inProgress: boolean;
        timestamp: number;
        error: any;
    };
}
