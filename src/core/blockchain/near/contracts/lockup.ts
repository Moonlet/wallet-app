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
import BigNumber from 'bignumber.js';
import { NEAR_LOCKUP_BASE_GAS } from '../consts';

export class Lockup {
    public async selectStakingPool(
        tx: IPosTransaction,
        validator: IValidator
    ): Promise<IBlockchainTransaction<INearTransactionAdditionalInfoType>> {
        const transaction = await buildBaseTransaction(tx);
        const gas = NEAR_LOCKUP_BASE_GAS.mul(new BN(3));

        transaction.address = tx.account.meta.owner;
        transaction.toAddress = tx.account.address;
        transaction.feeOptions = { feeTotal: gas.toString() };

        transaction.additionalInfo.posAction = PosBasicActionType.SELECT_STAKING_POOL;
        transaction.additionalInfo.validatorName = validator.name;

        transaction.additionalInfo.actions = [
            {
                type: NearTransactionActionType.FUNCTION_CALL,
                params: [
                    NearFunctionCallMethods.SELECT_STAKING_POOL,
                    { staking_pool_account_id: validator.id },
                    gas,
                    new BN(0)
                ]
            }
        ];

        return transaction;
    }

    public async stake(
        tx: IPosTransaction,
        validator: IValidator,
        unstakedAmount: BigNumber
    ): Promise<IBlockchainTransaction<INearTransactionAdditionalInfoType>> {
        const transaction = await buildBaseTransaction(tx);
        const gas = NEAR_LOCKUP_BASE_GAS.mul(new BN(5));

        transaction.address = tx.account.meta.owner;
        transaction.toAddress = tx.account.address;
        transaction.feeOptions = { feeTotal: gas.toString() };

        transaction.additionalInfo.posAction = PosBasicActionType.STAKE;
        transaction.additionalInfo.validatorName = validator.name;

        if (unstakedAmount.isGreaterThan(new BigNumber(tx.amount))) {
            // STAKE
            transaction.additionalInfo.actions = [
                {
                    type: NearTransactionActionType.FUNCTION_CALL,
                    params: [NearFunctionCallMethods.STAKE, { amount: tx.amount }, gas, new BN(0)]
                }
            ];
        } else {
            // DEPOSIT_AND_STAKE
            transaction.additionalInfo.actions = [
                {
                    type: NearTransactionActionType.FUNCTION_CALL,
                    params: [
                        NearFunctionCallMethods.DEPOSIT_AND_STAKE,
                        { amount: tx.amount },
                        gas,
                        new BN(0)
                    ]
                }
            ];
        }

        return transaction;
    }

    public async unstake(
        tx: IPosTransaction,
        validator: IValidator
    ): Promise<IBlockchainTransaction<INearTransactionAdditionalInfoType>> {
        const transaction = await buildBaseTransaction(tx);
        const gas = NEAR_LOCKUP_BASE_GAS.mul(new BN(3));

        transaction.address = tx.account.meta.owner;
        transaction.toAddress = tx.account.address;
        transaction.feeOptions = { feeTotal: gas.toString() };

        transaction.additionalInfo.posAction = PosBasicActionType.UNSTAKE;
        transaction.additionalInfo.validatorName = validator.name;

        transaction.additionalInfo.actions = [
            {
                type: NearTransactionActionType.FUNCTION_CALL,
                params: [NearFunctionCallMethods.UNSTAKE, { amount: tx.amount }, gas, new BN(0)]
            }
        ];

        return transaction;
    }
}
