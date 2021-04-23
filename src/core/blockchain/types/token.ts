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
    DELEGATE_V2 = 'DELEGATE_V2',
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
    CREATE_STAKE_ACCOUNT = 'CREATE_STAKE_ACCOUNT',
    SPLIT_STAKE = 'SPLIT STAKE',
    STAKE = 'STAKE',
    SEND = 'SEND',
    CREATE_ACCOUNT_AND_CLAIM = 'CREATE_ACCOUNT_AND_CLAIM',
    SELECT_STAKING_POOL = 'SELECT_STAKING_POOL',
    UNSELECT_STAKING_POOL = 'UNSELECT_STAKING_POOL',
    SOLANA_STAKEACCOUNT_DELEGATE = 'SOLANA_STAKE_ACCOUNT_DELEGATE',
    SOLANA_STAKEACCOUNT_CREATE = 'SOLANA_STAKEACCOUNT_CREATE',
    SOLANA_STAKEACCOUNT_SPLIT = 'SOLANA_STAKEACCOUNT_SPLIT',
    SOLANA_STAKEACCOUNT_WITHDRAW = 'SOLANA_STAKEACCOUNT_WITHDRAW',
    SOLANA_STAKEACCOUNT_UNSTAKE = 'SOLANA_STAKEACCOUNT_UNSTAKE',
    SOLANA_CREATE_AND_DELEGATE_STAKE_ACCOUNT = 'SOLANA_CREATE_AND_DELEGATE_STAKE_ACCOUNT'
}

export enum SwapType {
    BUY = 'BUY',
    SELL = 'SELL'
}

export enum SwapContractMethod {
    INCREASE_ALLOWANCE = 'IncreaseAllowance',
    SWAP_EXACT_ZIL_FOR_TOKENS = 'SwapExactZILForTokens',
    SWAP_EXACT_TOKENS_FOR_ZIL = 'SwapExactTokensForZIL',
    SWAP_EXACT_TOKENS_FOR_TOKENS = 'SwapExactTokensForTokens'
}
