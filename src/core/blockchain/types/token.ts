import BigNumber from 'bignumber.js';

export enum TokenType {
    NATIVE = 'NATIVE',
    ERC20 = 'ERC20',
    ZRC2 = 'ZRC2'
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
    symbolMap?: {
        [testnet: string]: string;
    };
    order: number;
    active: boolean;
    balance?: {
        value: string;
        inProgress: boolean;
        timestamp: number;
        error: any;
    };
}
