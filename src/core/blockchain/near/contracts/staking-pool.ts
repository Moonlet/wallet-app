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
import { NEAR_DEFAULT_FUNC_CALL_GAS } from '../consts';

export class StakingPool {
    public async stake(
        tx: IPosTransaction,
        validator: IValidator,
        depositAmount: BigNumber
    ): Promise<IBlockchainTransaction<INearTransactionAdditionalInfoType>> {
        const transaction = await buildBaseTransaction(tx);

        transaction.toAddress = validator.id;
        transaction.feeOptions = { feeTotal: NEAR_DEFAULT_FUNC_CALL_GAS.toString() };

        transaction.additionalInfo.posAction = PosBasicActionType.STAKE;
        transaction.additionalInfo.validatorName = validator.name;

        if (depositAmount.isGreaterThan(new BigNumber(0))) {
            // DEPOSIT and STAKE_ALL
            transaction.additionalInfo.actions = [
                {
                    type: NearTransactionActionType.FUNCTION_CALL,
                    params: [
                        NearFunctionCallMethods.DEPOSIT,
                        {},
                        NEAR_DEFAULT_FUNC_CALL_GAS,
                        new BN(depositAmount.toFixed())
                    ]
                },
                {
                    type: NearTransactionActionType.FUNCTION_CALL,
                    params: [
                        NearFunctionCallMethods.STAKE_ALL,
                        {},
                        NEAR_DEFAULT_FUNC_CALL_GAS,
                        new BN(0)
                    ]
                }
            ];
        } else {
            // STAKE
            transaction.additionalInfo.actions = [
                {
                    type: NearTransactionActionType.FUNCTION_CALL,
                    params: [
                        NearFunctionCallMethods.STAKE,
                        { amount: tx.amount },
                        NEAR_DEFAULT_FUNC_CALL_GAS,
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

        transaction.toAddress = validator.id;
        transaction.feeOptions = { feeTotal: NEAR_DEFAULT_FUNC_CALL_GAS.toString() };

        transaction.additionalInfo.posAction = PosBasicActionType.UNSTAKE;
        transaction.additionalInfo.validatorName = validator.name;

        transaction.additionalInfo.actions = [
            {
                type: NearTransactionActionType.FUNCTION_CALL,
                params: [
                    NearFunctionCallMethods.UNSTAKE,
                    { amount: tx.amount },
                    NEAR_DEFAULT_FUNC_CALL_GAS,
                    new BN(0)
                ]
            }
        ];

        return transaction;
    }

    public async withdraw(
        tx: IPosTransaction
    ): Promise<IBlockchainTransaction<INearTransactionAdditionalInfoType>> {
        const transaction = await buildBaseTransaction(tx);

        transaction.toAddress = tx.extraFields.validatorId;
        transaction.amount = tx.extraFields.amount;

        transaction.feeOptions = { feeTotal: NEAR_DEFAULT_FUNC_CALL_GAS.toString() };

        transaction.additionalInfo.posAction = PosBasicActionType.WITHDRAW;

        transaction.additionalInfo.actions = [
            {
                type: NearTransactionActionType.FUNCTION_CALL,
                params: [
                    NearFunctionCallMethods.WITHDRAW,
                    { amount: tx.extraFields.amount },
                    NEAR_DEFAULT_FUNC_CALL_GAS,
                    new BN(0)
                ]
            }
        ];

        return transaction;
    }
}
