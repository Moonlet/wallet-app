import BigNumber from 'bignumber.js';

export enum TokenType {
    NATIVE = 'NATIVE',
    ERC20 = 'ERC20',
    ZRC2 = 'ZRC2'
}

export enum TokenScreenComponentType {
    DEFAULT = 'DEFAULT',
    DELEGATE = 'DELEGATE'
}

export interface TokenIconType {
    uri: string;
    iconComponent?: any;
}

export interface ITokenConfig {
    name: string;
    symbol: string;
    icon?: TokenIconType;
    type: TokenType;
    contractAddress?: string;
    decimals: number;
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
    order: number;
    active: boolean;
    balance?: {
        value: string;
        inProgress: boolean;
        timestamp: number;
        error: any;
    };
}
