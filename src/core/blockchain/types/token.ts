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
    DELEGATE = 'DELEGATE', // stake or vote
    QUICK_DELEGATE = 'QUICK_DELEGATE', // stake or vote
    REDELEGATE = 'REDELEGATE', // restake or vote
    UNDELEGATE = 'UNDELEGATE', // unstake or unvote
    CLAIM_REWARD = 'CLAIM_REWARD', //  withdraw
    UNLOCK = 'UNLOCK',
    REINVEST = 'REINVEST'
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
    delegationType: DelegationType;
    navigateTo: { screen: string; params: any };
}
