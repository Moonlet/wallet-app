// import { Client } from '../client';
import { IPosTransaction, IBlockchainTransaction } from '../../types';
import { IValidator } from '../../types/stats';
// import { TokenType, PosBasicActionType } from '../../types/token';
import { buildBaseTransaction } from './base-contract';

// import { SystemProgram } from '@solana/web3.js/src/system-program';
// import { StakeProgram } from '@solana/web3.js/src/stake-program';
// import { PublicKey } from '@solana/web3.js/src/publickey';
// import { Account } from '@solana/web3.js/src/account';
// import { Transaction } from '@solana/web3.js/src/transaction';
import { SolanaTransactionInstructionType } from '../types';
import {
    createAccountWithSeedInstruction,
    deactivateInstruction,
    delegateInstruction,
    splitInstruction,
    withdrawInstruction
} from './instructions';
import { PosBasicActionType } from '../../types/token';
import { Client } from '../client';

export class Staking {
    constructor(private client: Client) {}

    public async createStakeAccountWithSeed(tx: IPosTransaction): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);
        const blockHash = await this.client.getCurrentBlockHash();
        const instruction = await createAccountWithSeedInstruction(tx);

        transaction.additionalInfo = {
            type: SolanaTransactionInstructionType.CREATE_ACCOUNT_WITH_SEED,
            instructions: [instruction.instruction],
            currentBlockHash: blockHash,
            posAction: PosBasicActionType.CREATE_STAKE_ACCOUNT
        };

        return transaction;
    }

    public async unStake(
        tx: IPosTransaction,
        validator: IValidator
    ): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);

        const blockHash = await this.client.getCurrentBlockHash();
        const instruction = await deactivateInstruction(tx);

        transaction.additionalInfo = {
            posAction: PosBasicActionType.UNSTAKE,
            validatorName: validator.name,
            type: SolanaTransactionInstructionType.UNSTAKE,
            instructions: [instruction.instruction],
            currentBlockHash: blockHash
        };

        return transaction;
    }

    public async splitStake(
        tx: IPosTransaction,
        splitStakePubKey: string
    ): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);

        const blockHash = await this.client.getCurrentBlockHash();
        const instruction = await splitInstruction(tx, splitStakePubKey);

        transaction.additionalInfo = {
            posAction: PosBasicActionType.SPLIT_STAKE,
            type: SolanaTransactionInstructionType.SPLIT_STAKE,
            instructions: [instruction.instruction],
            currentBlockHash: blockHash
        };

        return transaction;
    }

    public async delegateStake(
        tx: IPosTransaction,
        validator: IValidator
    ): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);

        const blockHash = await this.client.getCurrentBlockHash();
        const instruction = await delegateInstruction(tx, validator);

        transaction.additionalInfo = {
            posAction: PosBasicActionType.STAKE,
            validatorName: validator.name,
            type: SolanaTransactionInstructionType.DELEGATE_STAKE,
            instructions: [instruction.instruction],
            currentBlockHash: blockHash
        };

        return transaction;
    }

    public async withdraw(tx: IPosTransaction): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);

        const blockHash = await this.client.getCurrentBlockHash();
        const instruction = await withdrawInstruction(tx);

        transaction.additionalInfo = {
            posAction: PosBasicActionType.WITHDRAW,
            type: SolanaTransactionInstructionType.WITHDRAW,
            instructions: [instruction.instruction],
            currentBlockHash: blockHash
        };

        return transaction;
    }
}
