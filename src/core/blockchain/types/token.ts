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

export interface TokenIcon {
    uri?: string;
    iconComponent?: any;
}

export interface ITokenConfig {
    name: string;
    symbol: string;
    icon?: TokenIcon;
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
