import { Client } from '../client';
import { IPosTransaction, IBlockchainTransaction, TransactionType, Contracts } from '../../types';
import { IValidator } from '../../types/stats';
import { TokenType, PosBasicActionType } from '../../types/token';
import { buildBaseTransaction, getContract, ContractFields } from './base-contract';
import { isBech32 } from '@zilliqa-js/util/dist/validation';
import { fromBech32Address } from '@zilliqa-js/crypto/dist/bech32';
import BigNumber from 'bignumber.js';

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

    public async getMinDelegateStake(): Promise<BigNumber> {
        try {
            const contract = await this.getContractImplementation();

            const response = await this.client.getSmartContractSubState(
                contract.implementation,
                ContractFields.MINDELEGATESTAKE
            );

            return response && response[ContractFields.MINDELEGATESTAKE];
        } catch (error) {
            return Promise.reject(error);
        }
    }

    public async canUnstakeFromSsn(accountAddress: string, ssnaddr: string): Promise<boolean> {
        const address = isBech32(accountAddress)
            ? fromBech32Address(accountAddress).toLowerCase()
            : accountAddress.toLowerCase();

        try {
            const contract = await this.getContractImplementation();

            const cycleCalls = [
                this.client.getSmartContractSubState(
                    contract.implementation,
                    ContractFields.LASTREWARDCYCLE
                ),
                this.client.getSmartContractSubState(
                    contract.implementation,
                    ContractFields.LAST_BUF_DEPOSIT_CYCLE_DELEG,
                    [address]
                )
            ];

            const res = await Promise.all(cycleCalls);

            const lastRewardCycle = res[0] && Number(res[0][ContractFields.LASTREWARDCYCLE]);

            const lastBufferDepositCycleDeleg =
                res[1] &&
                res[1][ContractFields.LAST_BUF_DEPOSIT_CYCLE_DELEG] &&
                res[1][ContractFields.LAST_BUF_DEPOSIT_CYCLE_DELEG][address];

            let lastBufferDepositCycleDelegValue = 0;
            if (lastBufferDepositCycleDeleg && lastBufferDepositCycleDeleg[ssnaddr]) {
                lastBufferDepositCycleDelegValue = Number(lastBufferDepositCycleDeleg[ssnaddr]);
            }

            if (lastRewardCycle <= lastBufferDepositCycleDelegValue) return false;

            return true;
        } catch (error) {
            return false;
        }
    }

    public async getNrCyclesSinceLastWithdraw(
        accountAddress: string,
        ssnaddr: string
    ): Promise<number> {
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

            const lastRewardCycle = res[1] && Number(res[1][ContractFields.LASTREWARDCYCLE]);

            const lastWithdrawCycleDeleg =
                res[0] &&
                res[0][ContractFields.LAST_WITHDRAW_CYCLE_DELEG] &&
                res[0][ContractFields.LAST_WITHDRAW_CYCLE_DELEG][address];

            let lastWithdrawCycleDelegValue = 0;
            if (lastWithdrawCycleDeleg && lastWithdrawCycleDeleg[ssnaddr]) {
                lastWithdrawCycleDelegValue = Number(lastWithdrawCycleDeleg[ssnaddr]);
            }

            return lastRewardCycle - lastWithdrawCycleDelegValue;
        } catch (error) {
            return 10;
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
                ),
                this.client.getSmartContractSubState(
                    contract.implementation,
                    ContractFields.LAST_BUF_DEPOSIT_CYCLE_DELEG,
                    [address]
                )
            ];

            const res = await Promise.all(cycleCalls);

            const lastWithdrawCycleDeleg =
                res[0] &&
                res[0][ContractFields.LAST_WITHDRAW_CYCLE_DELEG] &&
                res[0][ContractFields.LAST_WITHDRAW_CYCLE_DELEG][address];

            const lastRewardCycle = res[1] && Number(res[1][ContractFields.LASTREWARDCYCLE]);

            const lastBufferDepositCycleDeleg =
                res[2] &&
                res[2][ContractFields.LAST_BUF_DEPOSIT_CYCLE_DELEG] &&
                res[2][ContractFields.LAST_BUF_DEPOSIT_CYCLE_DELEG][address];

            let lastBufferDepositCycleDelegValue = 0;
            if (lastBufferDepositCycleDeleg && lastBufferDepositCycleDeleg[ssnaddr]) {
                lastBufferDepositCycleDelegValue = Number(lastBufferDepositCycleDeleg[ssnaddr]);
            }
            let lastWithdrawCycleDelegValue = 0;
            if (lastWithdrawCycleDeleg && lastWithdrawCycleDeleg[ssnaddr]) {
                lastWithdrawCycleDelegValue = Number(lastWithdrawCycleDeleg[ssnaddr]);
            }

            if (lastRewardCycle > lastBufferDepositCycleDelegValue) {
                if (lastRewardCycle !== lastWithdrawCycleDelegValue) return true;
            }

            return false;
        } catch (error) {
            return false;
        }
    }

    public async reDelegateStake(
        tx: IPosTransaction,
        fromValidator: IValidator,
        toValidator: IValidator
    ): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);
        const contractAddress = await getContract(this.client.chainId, Contracts.STAKING);

        transaction.toAddress = contractAddress;
        transaction.amount = '0';
        const toAddress = isBech32(toValidator.id)
            ? fromBech32Address(toValidator.id).toLowerCase()
            : toValidator.id.toLowerCase();
        const fromAddress = isBech32(fromValidator.id)
            ? fromBech32Address(fromValidator.id).toLowerCase()
            : fromValidator.id.toLowerCase();

        const raw = JSON.stringify({
            _tag: 'ReDelegateStake',
            params: [
                {
                    vname: 'ssnaddr',
                    type: 'ByStr20',
                    value: fromAddress
                },
                {
                    vname: 'to_ssn',
                    type: 'ByStr20',
                    value: toAddress
                },
                {
                    vname: 'amount',
                    type: 'Uint128',
                    value: tx.amount
                }
            ]
        });

        const fees = await this.client.getFees(
            TransactionType.CONTRACT_CALL,
            {
                from: tx.account.address,
                to: toValidator.id,
                amount: tx.amount,
                contractAddress,
                raw
            },
            TokenType.ZRC2
        );
        transaction.feeOptions = fees;

        transaction.data = {
            method: 'Stake',
            params: [toValidator.id, tx.amount],
            raw
        };

        transaction.additionalInfo.posAction = PosBasicActionType.REDELEGATE;
        transaction.additionalInfo.validatorName = toValidator.name;

        return transaction;
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
                    vname: 'ssnaddr',
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

        let nrCyclesPassed = 0;
        try {
            nrCyclesPassed = await this.getNrCyclesSinceLastWithdraw(
                tx.account.address,
                validator.id
            );
        } catch {
            // doesnt need a catch handle
        }
        // TODO find a better way to get the rewards amount.
        // const chartData = tx.validators[0].chartStats.find(chart => chart.title === 'Reward');

        transaction.toAddress = contractAddress;
        transaction.amount = '0';
        const toAddress = isBech32(validator.id)
            ? fromBech32Address(validator.id).toLowerCase()
            : validator.id.toLowerCase();

        const raw = JSON.stringify({
            _tag: 'WithdrawStakeRewards',
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

        let gasLimitBasedOnCycles = 3450; // default value
        if (nrCyclesPassed >= 365) {
            gasLimitBasedOnCycles = 50000;
        } else if (nrCyclesPassed >= 180) {
            gasLimitBasedOnCycles = 30000;
        } else if (nrCyclesPassed >= 90) {
            gasLimitBasedOnCycles = 25000;
        } else if (nrCyclesPassed >= 60) {
            gasLimitBasedOnCycles = 20000;
        } else if (nrCyclesPassed >= 30) {
            gasLimitBasedOnCycles = 15000;
        } else if (nrCyclesPassed >= 14) {
            gasLimitBasedOnCycles = 10000;
        } else if (nrCyclesPassed >= 7) {
            gasLimitBasedOnCycles = 7000;
        } else if (nrCyclesPassed >= 3) {
            gasLimitBasedOnCycles = 3500;
        } else if (nrCyclesPassed >= 2) {
            gasLimitBasedOnCycles = 2700;
        } else {
            gasLimitBasedOnCycles = 2450;
        }

        transaction.feeOptions = {
            feeTotal: new BigNumber(fees.gasPrice)
                .multipliedBy(new BigNumber(gasLimitBasedOnCycles))
                .toFixed(),
            gasLimit: gasLimitBasedOnCycles.toString(),
            gasPrice: new BigNumber(fees.gasPrice).toFixed()
        };

        transaction.data = {
            method: 'Claim Rewards',
            params: [validator.id, undefined],
            raw
        };

        transaction.additionalInfo.posAction = PosBasicActionType.CLAIM_REWARD;
        transaction.additionalInfo.validatorName = validator.name;

        return transaction;
    }

    public async completeWithdrawal(tx: IPosTransaction): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);
        const contractAddress = await getContract(this.client.chainId, Contracts.STAKING);

        transaction.toAddress = contractAddress;
        transaction.amount = '0';

        const raw = JSON.stringify({
            _tag: 'CompleteWithdrawal',
            params: []
        });

        const fees = await this.client.getFees(
            TransactionType.CONTRACT_CALL,
            {
                from: tx.account.address,
                to: '',
                amount: tx.amount,
                contractAddress,
                raw
            },
            TokenType.ZRC2
        );
        transaction.feeOptions = fees;

        transaction.data = {
            method: 'withdraw',
            params: [contractAddress, tx.extraFields.amount],
            raw
        };

        transaction.additionalInfo.posAction = PosBasicActionType.WITHDRAW;

        return transaction;
    }
}
