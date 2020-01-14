import BigNumber from 'bignumber.js';

export enum TokenType {
    NATIVE = 'NATIVE',
    ERC20 = 'ERC20'
}

export interface ITokenConfig {
    name: string;
    symbol: string;
    logo?: any;
    type: TokenType;
    contractAddress?: string;
    decimals: number;
    uiDecimals: number;
    units?: {
        [unit: string]: BigNumber;
    };
    order: number;
    active: boolean;
    balance?: {
        value: BigNumber;
        inProgress: boolean;
        timestamp: number;
        error: any;
    };
}
