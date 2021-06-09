import { Client } from '../client';
import { IPosTransaction, IBlockchainTransaction, TransactionType, Contracts } from '../../types';
import { IValidator } from '../../types/stats';
import { TokenType, PosBasicActionType } from '../../types/token';
import { buildBaseTransaction, getContract } from './base-contract';
import abi from 'ethereumjs-abi';
import { MethodSignature } from '../types';

export class Staking {
    constructor(private client: Client) {}

    public async delegate(
        tx: IPosTransaction,
        validator: IValidator
    ): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);
        const contractAddress = await getContract(this.client.chainId, Contracts.STAKING);

        transaction.toAddress = contractAddress;
        transaction.amount = '0';
        const raw =
            '0x' +
            abi.simpleEncode('delegate(address,uint256)', validator.id, tx.amount).toString('hex');

        const fees = await this.client.getFees(
            TransactionType.CONTRACT_CALL,
            {
                from: tx.account.address,
                to: validator.id,
                amount: tx.amount,
                contractAddress,
                raw
            },
            TokenType.ERC20
        );
        transaction.feeOptions = fees;

        transaction.data = {
            method: 'Stake',
            params: [validator.id, tx.amount],
            raw
        };

        transaction.additionalInfo.posAction = PosBasicActionType.STAKE;
        transaction.additionalInfo.validatorName = validator.name;
        transaction.additionalInfo.tokenSymbol = 'GRT';
        return transaction;
    }

    public async increaseAllowance(
        tx: IPosTransaction,
        contractAddress: string
    ): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);
        const allowanceContract = await getContract(this.client.chainId, Contracts.STAKING);

        transaction.toAddress = contractAddress;
        transaction.amount = '0';
        const raw =
            '0x' +
            abi
                .simpleEncode(MethodSignature.INCREASE_ALLOWANCE, allowanceContract, tx.amount)
                .toString('hex');

        const fees = await this.client.getFees(
            TransactionType.CONTRACT_CALL,
            {
                from: tx.account.address,
                to: allowanceContract,
                amount: tx.amount,
                contractAddress,
                raw
            },
            TokenType.ERC20
        );
        transaction.feeOptions = fees;

        transaction.data = {
            method: 'Increase Allowance',
            params: [allowanceContract, tx.amount],
            raw
        };

        transaction.additionalInfo.posAction = PosBasicActionType.INCREASE_ALLOWANCE;
        transaction.additionalInfo.tokenSymbol = 'GRT';

        return transaction;
    }

    public async undelegate(
        tx: IPosTransaction,
        validator: IValidator
    ): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);
        const contractAddress = await getContract(this.client.chainId, Contracts.STAKING);

        transaction.toAddress = contractAddress;
        transaction.amount = '0';

        const raw =
            '0x' +
            abi.simpleEncode(MethodSignature.UNDELEGATE, validator.id, tx.amount).toString('hex');

        const fees = await this.client.getFees(
            TransactionType.CONTRACT_CALL,
            {
                from: tx.account.address,
                to: validator.id,
                amount: tx.amount,
                contractAddress,
                raw
            },
            TokenType.ERC20
        );
        transaction.feeOptions = fees;

        transaction.data = {
            method: 'Unstake',
            params: [validator.id, tx.amount],
            raw
        };

        transaction.additionalInfo.posAction = PosBasicActionType.UNSTAKE;
        transaction.additionalInfo.validatorName = validator.name;
        transaction.additionalInfo.tokenSymbol = 'GRT';

        return transaction;
    }

    public async withdrawDelegated(
        tx: IPosTransaction,
        validator: IValidator
    ): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);
        const contractAddress = await getContract(this.client.chainId, Contracts.STAKING);

        transaction.toAddress = contractAddress;
        transaction.amount = '0';

        const raw =
            '0x' +
            abi
                .simpleEncode(
                    MethodSignature.WITHDRAW_DELEGATED,
                    validator.id,
                    '0x000000000000000000000000000000000000'
                )
                .toString('hex');

        const fees = await this.client.getFees(
            TransactionType.CONTRACT_CALL,
            {
                from: tx.account.address,
                to: validator.id,
                amount: tx.amount,
                contractAddress,
                raw
            },
            TokenType.ERC20
        );
        transaction.feeOptions = fees;

        transaction.data = {
            method: 'Withdraw',
            params: [validator.id, tx.extraFields.amount],
            raw
        };

        transaction.additionalInfo.posAction = PosBasicActionType.WITHDRAW;
        transaction.additionalInfo.validatorName = validator.name;
        transaction.additionalInfo.tokenSymbol = 'GRT';

        return transaction;
    }
}
