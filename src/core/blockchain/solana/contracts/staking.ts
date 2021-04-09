// import { Client } from '../client';
import { IPosTransaction, IBlockchainTransaction } from '../../types';
import { IValidator } from '../../types/stats';
// import { TokenType, PosBasicActionType } from '../../types/token';
import { buildBaseTransaction } from './base-contract';

import { SystemProgram } from '@solana/web3.js/src/system-program';
import { StakeProgram, STAKE_INSTRUCTION_LAYOUTS } from '@solana/web3.js/src/stake-program';
import { encodeData } from '@solana/web3.js/src/instruction';
import { PublicKey } from '@solana/web3.js/src/publickey';
// import { Account } from '@solana/web3.js/src/account';
import { Transaction } from '@solana/web3.js/src/transaction';
import { SolanaTransactionInstructionType } from '../types';
import {
    createAccountWithSeedInstruction,
    deactivateInstruction,
    delegateInstruction,
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

        transaction.confirmations = {
            numConfirmations: 0,
            numConfirmationsNeeded: 32
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

    public async split(tx: IPosTransaction): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);

        const blockHash = await this.client.getCurrentBlockHash();
        const stakePubkey = new PublicKey(tx.extraFields.stakeAccountKey);
        const baseAccountKey = new PublicKey(tx.account.address);
        const splitFromKey = new PublicKey(tx.extraFields.splitFrom);

        const solanaTransaction = new Transaction();
        solanaTransaction.add(
            SystemProgram.createAccountWithSeed({
                fromPubkey: baseAccountKey,
                newAccountPubkey: stakePubkey,
                basePubkey: baseAccountKey,
                seed: `stake:${tx.extraFields.stakeAccountIndex}`,
                lamports: tx.amount,
                space: StakeProgram.space,
                programId: StakeProgram.programId
            })
        );

        const type = STAKE_INSTRUCTION_LAYOUTS.Split;
        const data = encodeData(type, { lamports: tx.amount });

        solanaTransaction.add({
            keys: [
                { pubkey: splitFromKey, isSigner: false, isWritable: true },
                { pubkey: stakePubkey, isSigner: false, isWritable: true },
                { pubkey: baseAccountKey, isSigner: true, isWritable: false }
            ],
            programId: StakeProgram.programId,
            data
        });

        transaction.additionalInfo = {
            posAction: PosBasicActionType.SPLIT_STAKE,
            type: SolanaTransactionInstructionType.SPLIT_STAKE,
            splitTransaction: solanaTransaction,
            currentBlockHash: blockHash
        };

        transaction.confirmations = {
            numConfirmations: 0,
            numConfirmationsNeeded: 32
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
            currentBlockHash: blockHash,
            stakeAccountKey: tx.extraFields.stakeAccountKey
        };

        return transaction;
    }
}
