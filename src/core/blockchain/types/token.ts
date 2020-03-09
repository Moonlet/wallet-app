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

export interface ITokenIcon {
    uri?: string;
    iconComponent?: React.ComponentType<any>;
}

export interface ITokenConfig {
    name: string;
    symbol: string;
    icon?: ITokenIcon;
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

export const GENERIC_TOKEN_ICON = {
    uri:
        'https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/icon/generic.png'
};
