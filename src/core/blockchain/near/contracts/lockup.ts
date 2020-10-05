import { IPosTransaction, IBlockchainTransaction } from '../../types';
import { IValidator } from '../../types/stats';
import { PosBasicActionType } from '../../types/token';
import { buildBaseTransaction } from './base-contract';
import {
    INearTransactionAdditionalInfoType,
    NearTransactionActionType,
    NearFunctionCallMethods
} from '../types';
import BN from 'bn.js';
import { NEAR_DEFAULT_FUNC_CALL_GAS } from '../consts';

export class Lockup {
    public async selectStakingPool(
        tx: IPosTransaction,
        validator: IValidator
    ): Promise<IBlockchainTransaction<INearTransactionAdditionalInfoType>> {
        const transaction = await buildBaseTransaction(tx);

        // TODO

        transaction.toAddress = validator.id;
        transaction.feeOptions = { feeTotal: NEAR_DEFAULT_FUNC_CALL_GAS.toString() };

        transaction.additionalInfo.posAction = PosBasicActionType.UNSTAKE;
        transaction.additionalInfo.validatorName = validator.name;

        transaction.additionalInfo.actions = [
            {
                type: NearTransactionActionType.FUNCTION_CALL,
                params: [
                    NearFunctionCallMethods.SELECT_STAKING_POOL,
                    { amount: tx.amount },
                    new BN(75000000000000),
                    new BN(0)
                ]
            }
        ];

        return transaction;
    }

    public async stake(
        tx: IPosTransaction,
        validator: IValidator
    ): Promise<IBlockchainTransaction<INearTransactionAdditionalInfoType>> {
        const transaction = await buildBaseTransaction(tx);

        transaction.address = tx.account.meta.owner;
        transaction.toAddress = tx.account.address;
        transaction.feeOptions = { feeTotal: NEAR_DEFAULT_FUNC_CALL_GAS.toString() };

        transaction.additionalInfo.posAction = PosBasicActionType.STAKE;
        transaction.additionalInfo.validatorName = validator.name;

        transaction.additionalInfo.actions = [
            {
                type: NearTransactionActionType.FUNCTION_CALL,
                params: [
                    NearFunctionCallMethods.DEPOSIT_AND_STAKE,
                    { amount: tx.amount },
                    new BN(125000000000000),
                    new BN(0)
                ]
            }
        ];

        return transaction;
    }

    public async unstake(
        tx: IPosTransaction,
        validator: IValidator
    ): Promise<IBlockchainTransaction<INearTransactionAdditionalInfoType>> {
        const transaction = await buildBaseTransaction(tx);

        transaction.address = tx.account.meta.owner;
        transaction.toAddress = tx.account.address;
        transaction.feeOptions = { feeTotal: NEAR_DEFAULT_FUNC_CALL_GAS.toString() };

        transaction.additionalInfo.posAction = PosBasicActionType.UNSTAKE;
        transaction.additionalInfo.validatorName = validator.name;

        transaction.additionalInfo.actions = [
            {
                type: NearTransactionActionType.FUNCTION_CALL,
                params: [
                    NearFunctionCallMethods.UNSTAKE,
                    { amount: tx.amount },
                    new BN(125000000000000),
                    new BN(0)
                ]
            }
        ];

        return transaction;
    }
}
