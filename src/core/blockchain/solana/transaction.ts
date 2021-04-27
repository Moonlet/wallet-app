import {
    AbstractBlockchainTransactionUtils,
    IBlockchainTransaction,
    IPosTransaction,
    ITransferTransaction,
    TransactionType
} from '../types';

import { TransactionStatus } from '../../wallet/types';
import { PosBasicActionType, TokenType } from '../types/token';
import { Solana } from '.';
import { Client as SolanaClient } from './client';
import { getTokenConfig } from '../../../redux/tokens/static-selectors';
import { StakeProgram } from '@solana/web3.js/src/stake-program';
import { SystemProgram } from '@solana/web3.js/src/system-program';
import { PublicKey } from '@solana/web3.js/src/publickey';
import { Account } from '@solana/web3.js/src/account';
import { Transaction } from '@solana/web3.js/src/transaction';
import { SolanaTransactionInstructionType } from './types';
import { decode as bs58Decode } from 'bs58';
import { cloneDeep } from 'lodash';
import { config, Contracts } from '../solana/config';
import { splitStake } from '../../utils/balance';
import BigNumber from 'bignumber.js';
import { selectStakeAccounts } from './contracts/base-contract';
import { getBlockchain } from '../blockchain-factory';

export class SolanaTransactionUtils extends AbstractBlockchainTransactionUtils {
    public async sign(tx: IBlockchainTransaction, privateKey: string): Promise<any> {
        const account = new Account(bs58Decode(privateKey));
        const client = Solana.getClient(tx.chainId) as SolanaClient;
        let transaction;

        switch (tx.additionalInfo.type) {
            case SolanaTransactionInstructionType.CREATE_ACCOUNT_WITH_SEED:
                transaction = StakeProgram.createAccountWithSeed(tx.additionalInfo.instructions[0]);
                break;
            case SolanaTransactionInstructionType.DELEGATE_STAKE:
                transaction = StakeProgram.delegate(tx.additionalInfo.instructions[0]);
                break;
            case SolanaTransactionInstructionType.UNSTAKE:
                transaction = StakeProgram.deactivate(tx.additionalInfo.instructions[0]);
                break;
            case SolanaTransactionInstructionType.SPLIT_STAKE:
                transaction = tx.additionalInfo.splitTransaction;
                break;
            case SolanaTransactionInstructionType.WITHDRAW:
                transaction = StakeProgram.withdraw(tx.additionalInfo.instructions[0]);
                break;

            case SolanaTransactionInstructionType.TRANSFER:
                transaction = new Transaction();
                transaction.add(tx.additionalInfo.instructions[0]);
                break;
        }

        transaction.recentBlockhash = await client.getCurrentBlockHash();

        transaction.sign(...[account]);

        return transaction.serialize();
    }

    public async buildPosTransaction(
        tx: IPosTransaction,
        transactionType: PosBasicActionType
    ): Promise<IBlockchainTransaction[]> {
        const client = Solana.getClient(tx.chainId);

        const transactions: IBlockchainTransaction[] = [];
        const allStakeAccounts = tx.account.tokens[client.chainId][config.coin].balance?.detailed;
        const usedStakedAccounts: string[] = [];

        switch (transactionType) {
            case PosBasicActionType.DELEGATE:
                const splitAmount = splitStake(new BigNumber(tx.amount), tx.validators.length);

                for (const validator of tx.validators) {
                    const stakeAccounts = selectStakeAccounts(
                        tx.account.address,
                        allStakeAccounts,
                        PosBasicActionType.DELEGATE,
                        splitAmount.toFixed(),
                        usedStakedAccounts
                    );

                    for (const key in stakeAccounts) {
                        if (stakeAccounts[key]) {
                            const stakeAccount = stakeAccounts[key];

                            if (stakeAccount.options?.shouldCreate) {
                                const txCreate: IPosTransaction = cloneDeep(tx);
                                txCreate.extraFields.stakeAccountKey = key;
                                txCreate.extraFields.stakeAccountIndex = stakeAccount.options.index;
                                txCreate.amount = new BigNumber(stakeAccount.amount).toFixed(
                                    0,
                                    BigNumber.ROUND_DOWN
                                );
                                const transactionCreate: IBlockchainTransaction = await client.contracts[
                                    Contracts.STAKING
                                ].createStakeAccountWithSeed(txCreate);
                                transactions.push(transactionCreate);
                            }

                            if (stakeAccount.options?.shouldSplit) {
                                const txSplit: IPosTransaction = cloneDeep(tx);
                                txSplit.amount = new BigNumber(stakeAccount.amount).toFixed(
                                    0,
                                    BigNumber.ROUND_DOWN
                                );
                                txSplit.extraFields.stakeAccountKey =
                                    stakeAccount.options.splitFrom;
                                txSplit.extraFields.stakeAccountIndex = stakeAccount.options.index;
                                const transactionSplit: IBlockchainTransaction = await client.contracts[
                                    Contracts.STAKING
                                ].split(txSplit, key);
                                transactions.push(transactionSplit);
                            }

                            const txStake: IPosTransaction = cloneDeep(tx);
                            txStake.amount = new BigNumber(stakeAccount.amount).toFixed(
                                0,
                                BigNumber.ROUND_DOWN
                            );
                            txStake.extraFields.stakeAccountKey = key;
                            const transaction: IBlockchainTransaction = await client.contracts[
                                Contracts.STAKING
                            ].delegateStake(txStake, validator);
                            transactions.push(transaction);
                            usedStakedAccounts.push(key);
                        }
                    }
                }
                break;
            case PosBasicActionType.UNSTAKE:
                const selectedStakeAccounts = selectStakeAccounts(
                    tx.account.address,
                    allStakeAccounts,
                    PosBasicActionType.UNSTAKE,
                    tx.amount,
                    usedStakedAccounts,
                    tx.validators[0].id
                );

                for (const key in selectedStakeAccounts) {
                    if (selectedStakeAccounts[key]) {
                        const stakeAccount = selectedStakeAccounts[key];

                        if (stakeAccount.options?.shouldSplit) {
                            const txSplit: IPosTransaction = cloneDeep(tx);
                            txSplit.amount = new BigNumber(stakeAccount.amount).toFixed(
                                0,
                                BigNumber.ROUND_DOWN
                            );
                            txSplit.extraFields.stakeAccountKey = stakeAccount.options.splitFrom;
                            txSplit.extraFields.stakeAccountIndex = stakeAccount.options.index;
                            const transactionSplit: IBlockchainTransaction = await client.contracts[
                                Contracts.STAKING
                            ].split(txSplit, key);
                            transactions.push(transactionSplit);
                        }

                        const txUnstake = cloneDeep(tx);
                        txUnstake.amount = new BigNumber(stakeAccount.amount).toFixed(
                            0,
                            BigNumber.ROUND_DOWN
                        );
                        txUnstake.extraFields.stakeAccountKey = key;
                        const transactionUnstake: IBlockchainTransaction = await client.contracts[
                            Contracts.STAKING
                        ].unStake(txUnstake, tx.validators[0]);
                        transactions.push(transactionUnstake);
                        usedStakedAccounts.push(key);
                    }
                }

                break;

            case PosBasicActionType.WITHDRAW:
                const transactionWithdraW: IBlockchainTransaction = await client.contracts[
                    Contracts.STAKING
                ].withdraw(cloneDeep(tx));

                transactionWithdraW.amount = new BigNumber(tx.extraFields.amount).toFixed(
                    0,
                    BigNumber.ROUND_DOWN
                );
                transactions.push(transactionWithdraW);
                break;

            case PosBasicActionType.SOLANA_STAKEACCOUNT_CREATE: {
                const solanaTxCreate: IPosTransaction = cloneDeep(tx);
                const solanaTransactionCreate: IBlockchainTransaction = await client.contracts[
                    Contracts.STAKING
                ].createStakeAccountWithSeed(solanaTxCreate);
                transactions.push(solanaTransactionCreate);
                break;
            }

            case PosBasicActionType.SOLANA_STAKEACCOUNT_DELEGATE: {
                const solanaTxStake: IPosTransaction = cloneDeep(tx);
                solanaTxStake.extraFields.amount = new BigNumber(
                    (tx.validators as any)[0].amount
                ).toFixed();
                const solanaTransactionDelegate: IBlockchainTransaction = await client.contracts[
                    Contracts.STAKING
                ].delegateStake(solanaTxStake, (tx.validators as any)[0].validator);
                transactions.push(solanaTransactionDelegate);
                break;
            }

            case PosBasicActionType.SOLANA_STAKEACCOUNT_SPLIT: {
                const solanaTxSplit: IPosTransaction = cloneDeep(tx);
                solanaTxSplit.amount = new BigNumber(tx.amount).toFixed();
                const solanaTransactionSplit: IBlockchainTransaction = await client.contracts[
                    Contracts.STAKING
                ].split(solanaTxSplit);

                transactions.push(solanaTransactionSplit);
                break;
            }

            case PosBasicActionType.SOLANA_STAKEACCOUNT_UNSTAKE: {
                const solanaTxUnstake: IPosTransaction = cloneDeep(tx);
                const solanaTransactionUnstake: IBlockchainTransaction = await client.contracts[
                    Contracts.STAKING
                ].unStake(solanaTxUnstake, tx.validators[0]);
                transactions.push(solanaTransactionUnstake);
                break;
            }

            case PosBasicActionType.SOLANA_STAKEACCOUNT_WITHDRAW: {
                const solanaTxWithdraw: IPosTransaction = cloneDeep(tx);
                const solanaTransactionWithdraw: IBlockchainTransaction = await client.contracts[
                    Contracts.STAKING
                ].withdraw(solanaTxWithdraw);
                transactions.push(solanaTransactionWithdraw);
                break;
            }

            case PosBasicActionType.SOLANA_CREATE_AND_DELEGATE_STAKE_ACCOUNT: {
                const blockchainInstance = getBlockchain(tx.account.blockchain);
                const tokenConfig = getTokenConfig(tx.account.blockchain, tx.token);

                const amount = blockchainInstance.account
                    .amountToStd(tx.extraFields.amount, tokenConfig.decimals)
                    .toFixed(0, BigNumber.ROUND_DOWN);

                // Create stake account tx
                const solanaTxCreate: IPosTransaction = cloneDeep(tx);
                solanaTxCreate.amount = amount;
                solanaTxCreate.extraFields.posAction =
                    PosBasicActionType.SOLANA_STAKEACCOUNT_CREATE;
                const solanaTransactionCreate: IBlockchainTransaction = await client.contracts[
                    Contracts.STAKING
                ].createStakeAccountWithSeed(solanaTxCreate);
                solanaTransactionCreate.amount = amount;
                transactions.push(solanaTransactionCreate);

                // Delegate tx
                const solanaTxStake: IPosTransaction = cloneDeep(tx);
                solanaTxStake.extraFields.amount = amount;
                solanaTxCreate.extraFields.posAction =
                    PosBasicActionType.SOLANA_STAKEACCOUNT_DELEGATE;
                const solanaTransactionDelegate: IBlockchainTransaction = await client.contracts[
                    Contracts.STAKING
                ].delegateStake(solanaTxStake, (tx.validators as any)[0].validator);
                transactions.push(solanaTransactionDelegate);
                break;
            }
        }

        return transactions;
    }

    public async buildTransferTransaction(
        tx: ITransferTransaction
    ): Promise<IBlockchainTransaction> {
        const client = Solana.getClient(tx.chainId) as SolanaClient;

        const tokenInfo = getTokenConfig(tx.account.blockchain, tx.token);
        const blockHash = await client.getCurrentBlockHash();
        const blockInfo = await client.getCurrentBlock();

        return {
            date: {
                created: Date.now(),
                signed: Date.now(),
                broadcasted: Date.now(),
                confirmed: Date.now()
            },
            blockchain: tx.account.blockchain,
            chainId: tx.chainId,
            type: TransactionType.TRANSFER,
            token: tokenInfo,

            address: tx.account.address,
            publicKey: tx.account.publicKey,

            toAddress: tx.toAddress,
            amount: tx.amount,
            feeOptions: tx.feeOptions,
            broadcastedOnBlock: blockInfo?.number,
            nonce: 0, // not used
            status: TransactionStatus.PENDING,
            additionalInfo: {
                currentBlockHash: blockHash,

                type: SolanaTransactionInstructionType.TRANSFER,
                instructions: [
                    SystemProgram.transfer({
                        fromPubkey: new PublicKey(tx.account.address),
                        toPubkey: new PublicKey(tx.toAddress),
                        lamports: tx.amount
                    })
                ]
            }
        };
    }

    public getTransactionAmount(tx: IBlockchainTransaction): string {
        const tokenInfo = getTokenConfig(tx.blockchain, tx.token?.symbol);
        if (tokenInfo.type === TokenType.ERC20) {
            return tx?.data?.params[1];
        } else {
            // Amount is stored on data params for stake tx
            if (
                tx?.additionalInfo?.type === SolanaTransactionInstructionType.DELEGATE_STAKE &&
                tx?.data?.params &&
                tx?.data?.params[1]
            ) {
                return tx?.data?.params[1];
            }
            return tx.amount;
        }
    }
}
