import { Blockchain, IPosTransaction } from '../../types';
import { IValidator } from '../../types/stats';

import { Authorized, Lockup } from '@solana/web3.js/src/stake-program';
import { PublicKey } from '@solana/web3.js/src/publickey';
import { ISolanaTransactionInstruction, SolanaTransactionInstructionType } from '../types';
import { getBlockchain } from '../../blockchain-factory';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';

export const createAccountWithSeedInstruction = (
    tx: IPosTransaction
): ISolanaTransactionInstruction => {
    // TODO - find correct stake account and seed
    const stakePubkey = new PublicKey(tx.extraFields.stakeAccountKey);
    const seed = `stake:${tx.extraFields.stakeAccountIndex}`;
    const baseAccountKey = new PublicKey(tx.account.address);
    return {
        type: SolanaTransactionInstructionType.CREATE_ACCOUNT_WITH_SEED,
        instruction: {
            fromPubkey: baseAccountKey,
            stakePubkey,
            basePubkey: baseAccountKey,
            seed,
            lamports: tx.amount,
            authorized: new Authorized(baseAccountKey, baseAccountKey),
            lockup: new Lockup(0, 0, baseAccountKey)
        }
    };
};

export const splitInstruction = async (
    tx: IPosTransaction,
    splitStakePubkey: string
): Promise<ISolanaTransactionInstruction> => {
    const stakePubkey = new PublicKey(tx.extraFields.stakeAccountKey);
    const baseAccountKey = new PublicKey(tx.account.address);

    return {
        type: SolanaTransactionInstructionType.SPLIT_STAKE,
        instruction: {
            stakePubkey,
            authorizedPubkey: baseAccountKey,
            lamports: Number(tx.amount),
            splitStakePubkey: new PublicKey(splitStakePubkey)
        }
    };
};

export const delegateInstruction = async (
    tx: IPosTransaction,
    validator: IValidator
): Promise<ISolanaTransactionInstruction> => {
    const stakePubkey = new PublicKey(tx.extraFields.stakeAccountKey);
    const baseAccountKey = new PublicKey(tx.account.address);
    return {
        type: SolanaTransactionInstructionType.DELEGATE_STAKE,
        instruction: {
            stakePubkey,
            authorizedPubkey: baseAccountKey,
            votePubkey: new PublicKey(validator.id)
        }
    };
};

export const deactivateInstruction = async (
    tx: IPosTransaction
): Promise<ISolanaTransactionInstruction> => {
    const stakePubkey = new PublicKey(tx.extraFields.stakeAccountKey);
    const baseAccountKey = new PublicKey(tx.account.address);
    return {
        type: SolanaTransactionInstructionType.UNSTAKE,
        instruction: {
            stakePubkey,
            authorizedPubkey: baseAccountKey
        }
    };
};

export const withdrawInstruction = async (
    tx: IPosTransaction
): Promise<ISolanaTransactionInstruction> => {
    const stakePubkey = new PublicKey(tx.extraFields.stakeAccountKey);
    const baseAccountKey = new PublicKey(tx.account.address);

    const blockchainInstance = getBlockchain(Blockchain.SOLANA);
    const tokenConfig = getTokenConfig(Blockchain.SOLANA, 'SOL');

    const amount = blockchainInstance.account
        .amountToStd(tx.extraFields.amount, tokenConfig.decimals)
        .toFixed();

    return {
        type: SolanaTransactionInstructionType.WITHDRAW,
        instruction: {
            stakePubkey,
            authorizedPubkey: baseAccountKey,
            toPubkey: baseAccountKey,
            lamports: amount
        }
    };
};
