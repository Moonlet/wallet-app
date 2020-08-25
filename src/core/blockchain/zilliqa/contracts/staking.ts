import { Client } from '../client';
import { IPosTransaction, IBlockchainTransaction, TransactionType } from '../../types';
import { IValidator } from '../../types/stats';
import { Contracts } from '../config';
import { TokenType, PosBasicActionType } from '../../types/token';
import { buildBaseTransaction, getContract } from './base-contract';
import { isBech32 } from '@zilliqa-js/util/dist/validation';
import { fromBech32Address } from '@zilliqa-js/crypto/dist/bech32';

export class Staking {
    constructor(private client: Client) {}

    async getContractImplementation(): Promise<any> {
        const contractAddress = await getContract(this.client.chainId, Contracts.STAKING);
        return this.client.getSmartContractSubState(contractAddress, 'implementation');
    }

    public async delegateStake(
        tx: IPosTransaction,
        validator: IValidator
    ): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);
        const contractAddress = await getContract(this.client.chainId, Contracts.STAKING);

        //  transaction.amount = '0';
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
                // {
                //     vname: 'amount',
                //     type: 'Uint128',
                //     value: tx.amount
                // }
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
            method: 'DelegateStake',
            params: [validator.id, tx.amount],
            raw
        };

        transaction.additionalInfo.posAction = PosBasicActionType.DELEGATE;
        transaction.additionalInfo.validatorName = validator.name;

        return transaction;
    }
}
