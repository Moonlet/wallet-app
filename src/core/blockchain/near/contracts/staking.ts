import { Client } from '../client';
import { IPosTransaction, IBlockchainTransaction, TransactionType } from '../../types';
import { IValidator } from '../../types/stats';
import { PosBasicActionType } from '../../types/token';
import { buildBaseTransaction } from './base-contract';

export class Staking {
    constructor(private client: Client) {}

    public async deposit(
        tx: IPosTransaction,
        validator: IValidator
    ): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);

        const contractAddress = validator.id;

        transaction.amount = tx.amount;
        transaction.toAddress = contractAddress;

        const fees = await this.client.getFees(TransactionType.CONTRACT_CALL, {
            from: tx.account.address,
            to: validator.id,
            amount: tx.amount,
            contractAddress
        });
        transaction.feeOptions = fees;

        transaction.data = {
            method: 'deposit',
            params: [validator.id, tx.amount]
        };

        transaction.additionalInfo.posAction = PosBasicActionType.DEPOSIT;
        transaction.additionalInfo.validatorName = validator.name;

        return transaction;
    }

    public async stake(
        tx: IPosTransaction,
        validator: IValidator
    ): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);

        const contractAddress = validator.id;

        transaction.amount = tx.amount;
        transaction.toAddress = contractAddress;

        const fees = await this.client.getFees(TransactionType.CONTRACT_CALL, {
            from: tx.account.address,
            to: validator.id,
            amount: tx.amount,
            contractAddress
        });
        transaction.feeOptions = fees;

        transaction.data = {
            method: 'stake',
            params: [validator.id, tx.amount]
        };

        transaction.additionalInfo.posAction = PosBasicActionType.STAKE;
        transaction.additionalInfo.validatorName = validator.name;

        return transaction;
    }

    public async unstake(
        tx: IPosTransaction,
        validator: IValidator
    ): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);

        const contractAddress = validator.id;

        transaction.amount = tx.amount;
        transaction.toAddress = contractAddress;

        const fees = await this.client.getFees(TransactionType.CONTRACT_CALL, {
            from: tx.account.address,
            to: validator.id,
            amount: tx.amount,
            contractAddress
        });
        transaction.feeOptions = fees;

        transaction.data = {
            method: 'unstake',
            params: [validator.id, tx.amount]
        };

        transaction.additionalInfo.posAction = PosBasicActionType.UNSTAKE;
        transaction.additionalInfo.validatorName = validator.name;

        return transaction;
    }

    public async withdraw(
        tx: IPosTransaction,
        validator: IValidator
    ): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);

        const contractAddress = validator.id;

        transaction.amount = tx.amount;
        transaction.toAddress = contractAddress;

        const fees = await this.client.getFees(TransactionType.CONTRACT_CALL, {
            from: tx.account.address,
            to: validator.id,
            amount: tx.amount,
            contractAddress
        });
        transaction.feeOptions = fees;

        transaction.data = {
            method: 'withdraw',
            params: [validator.id, tx.amount]
        };

        transaction.additionalInfo.posAction = PosBasicActionType.WITHDRAW;
        transaction.additionalInfo.validatorName = validator.name;

        return transaction;
    }
}
