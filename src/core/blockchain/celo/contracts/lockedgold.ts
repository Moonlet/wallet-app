import { Client } from '../client';
import BigNumber from 'bignumber.js';
import { IPosTransaction, IBlockchainTransaction } from '../../types';
import abi from 'ethereumjs-abi';
import { getContract, buildBaseTransaction } from './base-contract';
import { Contracts } from '../config';

export class LockedGold {
    constructor(private client: Client) {}

    public async getAccountNonvotingLockedGold(accountAddress: string): Promise<BigNumber> {
        const contractAddress = await getContract(this.client.chainId, Contracts.LOCKED_GOLD);

        return this.client
            .callContract(contractAddress, 'getAccountNonvotingLockedGold(address):(uint256)', [
                accountAddress
            ])
            .then(v => {
                return new BigNumber(v as string);
            });
    }

    public async getPendingWithdrawals(accountAddress: string): Promise<[]> {
        const contractAddress = await getContract(this.client.chainId, Contracts.LOCKED_GOLD);

        return this.client
            .callContract(contractAddress, 'getPendingWithdrawals(address):(uint256[],uint256[])', [
                accountAddress
            ])
            .then(res => {
                if (res && res.length > 1) {
                    const values: [] = res[0].split(',');
                    const timestamps: [] = res[1].split(',');
                    const pendingWithdrawals = [];
                    values.map((value: string, index: number) => {
                        pendingWithdrawals.push({
                            value,
                            time: new Date(timestamps[index] * 1000)
                        });
                    });
                    return pendingWithdrawals as [];
                }
            });
    }

    public async withdraw(tx: IPosTransaction, index: number): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);
        const contractAddress = await getContract(this.client.chainId, Contracts.LOCKED_GOLD);

        transaction.toAddress = contractAddress;
        transaction.amount = '0';
        transaction.data = {
            method: 'withdraw',
            params: [index.toString()],
            raw: '0x' + abi.simpleEncode('withdraw(uint256)', index).toString('hex')
        };

        return transaction;
    }

    public async lock(tx: IPosTransaction): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);
        const contractAddress = await getContract(this.client.chainId, Contracts.LOCKED_GOLD);

        transaction.toAddress = contractAddress;
        transaction.data = {
            method: 'lock',
            params: [tx.amount],
            raw: '0x' + abi.simpleEncode('lock()').toString('hex')
        };

        return transaction;
    }

    public async unlock(tx: IPosTransaction): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);
        const contractAddress = await getContract(this.client.chainId, Contracts.LOCKED_GOLD);

        transaction.toAddress = contractAddress;
        transaction.amount = '0';
        transaction.data = {
            method: 'unlock',
            params: [tx.amount],
            raw: '0x' + abi.simpleEncode('unlock(uint256)', tx.amount).toString('hex')
        };

        return transaction;
    }
}
