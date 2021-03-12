import { IBlockchainTransaction, IPosTransaction, TransactionType } from '../../types';
import { TokenType } from '../../types/token';
import { Client } from '../client';
import { Contracts } from '../config';
import { buildBaseTransaction, getContract } from './base-contract';

export class Swap {
    private contractImplementation;
    constructor(private client: Client) {}

    async getContractImplementation(): Promise<{ [address: string]: string }> {
        const contractAddress = await getContract(this.client.chainId, Contracts.SWAP);
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

    public async swapZilForTokens(
        tx: IPosTransaction,
        token: string
    ): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);
        const contractAddress = await getContract(this.client.chainId, Contracts.STAKING);
        const blockInfo = await this.client.getCurrentBlock();

        transaction.toAddress = contractAddress;

        const raw = JSON.stringify({
            _tag: 'SwapZILForExactTokens',
            params: [
                {
                    vname: 'token_address',
                    type: 'ByStr20',
                    value: token
                },
                {
                    vname: 'recipient_address',
                    type: 'ByStr20',
                    value: tx.account.address
                },
                {
                    vname: 'token_amount',
                    type: 'Uint128',
                    value: tx.amount
                },
                {
                    vname: 'deadline_block',
                    type: 'Uint128',
                    value: blockInfo.number + 100 // expire after 100 blocks
                }
            ]
        });

        const fees = await this.client.getFees(
            TransactionType.CONTRACT_CALL,
            {
                from: tx.account.address,
                to: contractAddress,
                amount: tx.amount,
                contractAddress,
                raw
            },
            TokenType.ZRC2
        );
        transaction.feeOptions = fees;

        transaction.data = {
            method: 'Swap Zil',
            params: [contractAddress, tx.amount],
            raw
        };

        return transaction;
    }

    public async swapTokensForZil(
        tx: IPosTransaction,
        token: string,
        minZilAmount: string
    ): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);
        const contractAddress = await getContract(this.client.chainId, Contracts.STAKING);
        const blockInfo = await this.client.getCurrentBlock();

        transaction.toAddress = contractAddress;

        const raw = JSON.stringify({
            _tag: 'SwapExactTokensForZIL',
            params: [
                {
                    vname: 'token_address',
                    type: 'ByStr20',
                    value: token
                },
                {
                    vname: 'min_zil_amount',
                    type: 'Uint128',
                    value: minZilAmount
                },
                {
                    vname: 'recipient_address',
                    type: 'ByStr20',
                    value: tx.account.address
                },
                {
                    vname: 'token_amount',
                    type: 'Uint128',
                    value: tx.amount
                },
                {
                    vname: 'deadline_block',
                    type: 'Uint128',
                    value: blockInfo.number + 100 // expire after 100 blocks
                }
            ]
        });

        const fees = await this.client.getFees(
            TransactionType.CONTRACT_CALL,
            {
                from: tx.account.address,
                to: contractAddress,
                amount: tx.amount,
                contractAddress,
                raw
            },
            TokenType.ZRC2
        );
        transaction.feeOptions = fees;

        transaction.data = {
            method: 'Swap Zil',
            params: [contractAddress, tx.amount],
            raw
        };

        return transaction;
    }
}
