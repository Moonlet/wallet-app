import { Client } from '../client';
import { IPosTransaction, IBlockchainTransaction, TransactionType } from '../../types';
import { getTokenConfig } from '../../../../redux/tokens/static-selectors';
import { TransactionStatus } from '../../../wallet/types';
import { IValidator } from '../../types/stats';
import { PosBasicActionType } from '../../types/token';
import { NearTransactionActionType } from '..';

export class Staking {
    constructor(private client: Client) {}

    private async buildBaseTransaction(tx: IPosTransaction): Promise<IBlockchainTransaction> {
        const tokenConfig = getTokenConfig(tx.account.blockchain, tx.token);

        const nonce = await this.client.getNonce(tx.account.address, tx.account.publicKey);
        const blockInfo = await this.client.getCurrentBlock();

        return {
            date: {
                created: Date.now(),
                signed: Date.now(),
                broadcasted: Date.now(),
                confirmed: Date.now()
            },
            blockchain: tx.account.blockchain,
            chainId: tx.chainId,
            type: TransactionType.CONTRACT_CALL,
            token: tokenConfig,
            address: tx.account.address,
            publicKey: tx.account.publicKey,
            toAddress: '',
            amount: tx.amount,
            feeOptions: tx.feeOptions,
            broadcastedOnBlock: blockInfo?.number,
            nonce,
            status: TransactionStatus.PENDING,
            data: {},
            additionalInfo: {
                ...tx.extraFields,
                currentBlockHash: blockInfo.hash,
                actions: [
                    {
                        type: NearTransactionActionType.FUNCTION_CALL
                    }
                ]
            }
        };
    }

    public async deposit(
        tx: IPosTransaction,
        validator: IValidator
    ): Promise<IBlockchainTransaction> {
        const transaction = await this.buildBaseTransaction(tx);

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
        const transaction = await this.buildBaseTransaction(tx);

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
}
