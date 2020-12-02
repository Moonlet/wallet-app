export enum SolanaTransactionInstructionType {
    TRANSFER = 'TRANSFER',
    CREATE_ACCOUNT_WITH_SEED = 'CREATE_ACCOUNT_WITH_SEED',
    DELEGATE_STAKE = 'DELEGATE_STAKE',
    SPLIT_STAKE = 'SPLIT_STAKE',
    UNSTAKE = 'UNSTAKE'
}

export interface ISolanaTransactionInstruction {
    type: SolanaTransactionInstructionType;
    instruction: any;
}

export interface IStakeAccountFormat {
    index: number;
    validatorId?: string;
    staked?: string;
    unstaked?: string;
    activating?: string;
    deactivating?: string;
}
