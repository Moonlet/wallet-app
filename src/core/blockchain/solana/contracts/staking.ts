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
import { createAccountWithSeedInstruction } from './instructions';

export class Staking {
    // constructor() {}

    public async createStakeAccountWithSeed(
        tx: IPosTransaction,
        validator: IValidator
    ): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);

        tx.extraFields.rootAccount = 'A9X3QSZqm6T1RM6gHTDZKWbxs3238N2kYhhE4L6HZTUZ';

        transaction.additionalInfo = {
            type: SolanaTransactionInstructionType.CREATE_ACCOUNT_WITH_SEED,
            instructions: [createAccountWithSeedInstruction(tx)]
        };

        return transaction;
    }

    public async delegateStake(
        tx: IPosTransaction,
        validator: IValidator
    ): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);

        return transaction;
    }
}
