export enum TokenType {
    NATIVE = 'NATIVE',
    ERC20 = 'ERC20',
    ZRC2 = 'ZRC2'
}

export enum TokenScreenComponentType {
    DEFAULT = 'DEFAULT',
    DELEGATE = 'DELEGATE'
}

export enum DelegationType {
    DEFAULT = 'DEFAULT',
    QUICK = 'QUICK'
}

export interface ITokenIcon {
    uri?: string;
    iconComponent?: React.ComponentType<any>;
}

export const GENERIC_TOKEN_ICON = {
    uri:
        'https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/icon/generic.png'
};

export interface IButtonCTA {
    title: string;
    iconName: string;
    navigateTo: { screen: string; params: any };
}
