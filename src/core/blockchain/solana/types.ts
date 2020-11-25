export enum SolanaTransactionInstructionType {
    TRANSFER = 'TRANSFER',
    CREATE_ACCOUNT_WITH_SEED = 'CREATE_ACCOUNT_WITH_SEED',
    DELEGATE_STAKE = 'DELEGATE_STAKE',
    UNSTAKE = 'UNSTAKE'
}

export interface ISolanaTransactionInstruction {
    type: SolanaTransactionInstructionType;
    instruction: any;
}
