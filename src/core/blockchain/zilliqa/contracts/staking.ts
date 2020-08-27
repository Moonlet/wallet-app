import { Client } from '../client';
import { IPosTransaction, IBlockchainTransaction, TransactionType } from '../../types';
import { IValidator } from '../../types/stats';
import { Contracts } from '../config';
import { TokenType, PosBasicActionType } from '../../types/token';
import { buildBaseTransaction, getContract, ContractFields } from './base-contract';
import { isBech32 } from '@zilliqa-js/util/dist/validation';
import { fromBech32Address } from '@zilliqa-js/crypto/dist/bech32';

export class Staking {
    private contractImplementation;
    constructor(private client: Client) {}

    async getContractImplementation(): Promise<{ [address: string]: string }> {
        const contractAddress = await getContract(this.client.chainId, Contracts.STAKING);
        try {
            if (!this.contractImplementation) {
                this.contractImplementation = await this.client.getSmartContractSubState(
                    contractAddress,
                    'implementation'
                );
            }
            return this.contractImplementation;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async canWithdrawStakeRewardsFromSsn(
        accountAddress: string,
        ssnaddr: string
    ): Promise<boolean> {
        const address = isBech32(accountAddress)
            ? fromBech32Address(accountAddress).toLowerCase()
            : accountAddress.toLowerCase();

        try {
            const contract = await this.getContractImplementation();

            const cycleCalls = [
                this.client.getSmartContractSubState(
                    contract.implementation,
                    ContractFields.LAST_WITHDRAW_CYCLE_DELEG,
                    [address]
                ),
                this.client.getSmartContractSubState(
                    contract.implementation,
                    ContractFields.LASTREWARDCYCLE
                )
            ];

            const res = await Promise.all(cycleCalls);

            const lastWithdrawCycleDeleg =
                res[0][ContractFields.LAST_WITHDRAW_CYCLE_DELEG][address];

            if (lastWithdrawCycleDeleg && lastWithdrawCycleDeleg[ssnaddr]) {
                const lastWithdrawCycleDelegValue = Number(lastWithdrawCycleDeleg[ssnaddr]);
                const lastRewardCycle = Number(res[1][ContractFields.LASTREWARDCYCLE]);

                if (lastRewardCycle > lastWithdrawCycleDelegValue) return true;
            }
        } catch (error) {
            return false;
        }
    }

    public async delegateStake(
        tx: IPosTransaction,
        validator: IValidator
    ): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);
        const contractAddress = await getContract(this.client.chainId, Contracts.STAKING);

        transaction.toAddress = contractAddress;

        const toAddress = isBech32(validator.id)
            ? fromBech32Address(validator.id).toLowerCase()
            : validator.id.toLowerCase();

        const raw = JSON.stringify({
            _tag: 'DelegateStake',
            params: [
                {
                    vname: 'ssnaddr',
                    type: 'ByStr20',
                    value: toAddress
                }
            ]
        });

        const fees = await this.client.getFees(
            TransactionType.CONTRACT_CALL,
            {
                from: tx.account.address,
                to: validator.id,
                amount: tx.amount,
                contractAddress,
                raw
            },
            TokenType.ZRC2
        );
        transaction.feeOptions = fees;

        transaction.data = {
            method: 'Stake',
            params: [validator.id, tx.amount],
            raw
        };

        transaction.additionalInfo.posAction = PosBasicActionType.STAKE;
        transaction.additionalInfo.validatorName = validator.name;

        return transaction;
    }

    public async withdrawStakAmt(
        tx: IPosTransaction,
        validator: IValidator
    ): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);
        const contractAddress = await getContract(this.client.chainId, Contracts.STAKING);

        transaction.toAddress = contractAddress;
        transaction.amount = '0';
        const toAddress = isBech32(validator.id)
            ? fromBech32Address(validator.id).toLowerCase()
            : validator.id.toLowerCase();

        const raw = JSON.stringify({
            _tag: 'WithdrawStakeAmt',
            params: [
                {
                    vname: 'ssn',
                    type: 'ByStr20',
                    value: toAddress
                },
                {
                    vname: 'amt',
                    type: 'Uint128',
                    value: tx.amount
                }
            ]
        });

        const fees = await this.client.getFees(
            TransactionType.CONTRACT_CALL,
            {
                from: tx.account.address,
                to: validator.id,
                amount: tx.amount,
                contractAddress,
                raw
            },
            TokenType.ZRC2
        );
        transaction.feeOptions = fees;

        transaction.data = {
            method: 'Unstake',
            params: [validator.id, tx.amount],
            raw
        };

        transaction.additionalInfo.posAction = PosBasicActionType.UNSTAKE;
        transaction.additionalInfo.validatorName = validator.name;

        return transaction;
    }

    public async withdrawStakRewards(
        tx: IPosTransaction,
        validator: IValidator
    ): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);
        const contractAddress = await getContract(this.client.chainId, Contracts.STAKING);

        transaction.toAddress = contractAddress;
        const toAddress = isBech32(validator.id)
            ? fromBech32Address(validator.id).toLowerCase()
            : validator.id.toLowerCase();

        const raw = JSON.stringify({
            _tag: 'WithdrawStakeRewards',
            params: [
                {
                    vname: 'ssn_operator',
                    type: 'ByStr20',
                    value: toAddress
                }
            ]
        });

        const fees = await this.client.getFees(
            TransactionType.CONTRACT_CALL,
            {
                from: tx.account.address,
                to: validator.id,
                amount: tx.amount,
                contractAddress,
                raw
            },
            TokenType.ZRC2
        );
        transaction.feeOptions = fees;

        transaction.data = {
            method: 'Claim Rewards',
            params: [validator.id, tx.amount],
            raw
        };

        transaction.additionalInfo.posAction = PosBasicActionType.CLAIM_REWARD;
        transaction.additionalInfo.validatorName = validator.name;

        return transaction;
    }
}