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
import BigNumber from 'bignumber.js';

const BASE_GAS = new BN('25000000000000');

export class Lockup {
    public async stake(
        tx: IPosTransaction,
        validator: IValidator,
        depositAmount: BigNumber, // TODO: implement this
        stakingPoolId: string
    ): Promise<IBlockchainTransaction<INearTransactionAdditionalInfoType>> {
        const transaction = await buildBaseTransaction(tx);

        transaction.address = tx.account.meta.owner;
        transaction.toAddress = tx.account.address;
        transaction.feeOptions = { feeTotal: NEAR_DEFAULT_FUNC_CALL_GAS.toString() }; // TODO: fix this, not accurate

        transaction.additionalInfo.posAction = PosBasicActionType.STAKE;
        transaction.additionalInfo.validatorName = validator.name;

        // DEPOSIT_AND_STAKE
        transaction.additionalInfo.actions = [
            {
                type: NearTransactionActionType.FUNCTION_CALL,
                params: [
                    NearFunctionCallMethods.DEPOSIT_AND_STAKE,
                    { amount: tx.amount },
                    BASE_GAS.mul(new BN(5)),
                    new BN(0)
                ]
            }
        ];

        // TODO: stake without deposit if unstaked is available

        if (!stakingPoolId) {
            transaction.additionalInfo.actions = [
                {
                    type: NearTransactionActionType.FUNCTION_CALL,
                    params: [
                        NearFunctionCallMethods.SELECT_STAKING_POOL,
                        { staking_pool_account_id: validator.id },
                        BASE_GAS.mul(new BN(3)),
                        new BN(0)
                    ]
                }
            ].concat(transaction.additionalInfo.actions);
        }

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
                    BASE_GAS.mul(new BN(3)),
                    new BN(0)
                ]
            }
        ];

        return transaction;
    }
}
