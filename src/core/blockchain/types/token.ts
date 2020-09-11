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

export const GENERIC_TOKEN_ICON = {
    uri:
        'https://raw.githubusercontent.com/atomiclabs/cryptocurrency-icons/master/128/icon/generic.png'
};

export interface IButtonCTA {
    title: string;
    iconName: string;
    navigateTo: { screen: string; params: any };
}

export enum PosBasicActionType {
    DELEGATE = 'DELEGATE',
    REDELEGATE = 'REDELEGATE',
    UNLOCK = 'UNLOCK',
    UNDELEGATE = 'UNDELEGATE',
    UNVOTE = 'UNVOTE',
    UNSTAKE = 'UNSTAKE',
    ACTIVATE = 'ACTIVATE',
    CLAIM_REWARD = 'CLAIM_REWARD',
    CLAIM_REWARD_NO_INPUT = 'CLAIM_REWARD_NO_INPUT',
    WITHDRAW = 'WITHDRAW',
    REINVEST = 'REINVEST',
    LOCK = 'LOCK',
    CREATE_ACCOUNT = 'CREATE_ACCOUNT',
    STAKE = 'STAKE'
}
