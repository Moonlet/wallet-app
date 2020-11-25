import { IPosTransaction } from '../../types';
import { IValidator } from '../../types/stats';

import { Authorized, Lockup } from '@solana/web3.js/src/stake-program';
import { PublicKey } from '@solana/web3.js/src/publickey';
import { ISolanaTransactionInstruction, SolanaTransactionInstructionType } from '../types';

export const createAccountWithSeedInstruction = (
    tx: IPosTransaction
): ISolanaTransactionInstruction => {
    const stakePubkey = '';
    const seed = '';
    const baseAccountKey = tx.extraFields.rootAccount;
    return {
        type: SolanaTransactionInstructionType.CREATE_ACCOUNT_WITH_SEED,
        instruction: {
            fromPubkey: new PublicKey(tx.account.address),
            stakePubkey,
            basePubkey: new PublicKey(tx.account.address),
            seed,
            lamports: tx.amount,
            authorized: new Authorized(baseAccountKey, baseAccountKey),
            lockup: new Lockup(0, 0, baseAccountKey)
        }
    };
};

export const delegateInstruction = (
    tx: IPosTransaction,
    validator: IValidator
): ISolanaTransactionInstruction => {
    const stakePubkey = tx.extraFields.stakeAccountKey;
    const baseAccountKey = tx.extraFields.rootAccount;
    return {
        type: SolanaTransactionInstructionType.DELEGATE_STAKE,
        instruction: {
            stakePubkey,
            authorizedPubkey: baseAccountKey,
            votePubkey: validator.id
        }
    };
};
