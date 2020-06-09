import { Client } from '../client';
import BigNumber from 'bignumber.js';
import { IPosTransaction, IBlockchainTransaction } from '../../types';
import abi from 'ethereumjs-abi';
import { getContractFor, buildBaseTransaction } from './base-contract';
import { Contracts } from '../config';

export class LockedGold {
    constructor(private client: Client) {}

    public async getAccountTotalLockedGold(accountAddress: string): Promise<BigNumber> {
        const contractAddress = await getContractFor(this.client.chainId, Contracts.LOCKED_GOLD);

        return this.client
            .callContract(contractAddress, 'getAccountTotalLockedGold(address):(uint256)', [
                accountAddress
            ])
            .then(v => {
                return new BigNumber(v as string);
            });
    }

    public async buildTransactionForLock(tx: IPosTransaction): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);
        const contractAddress = await getContractFor(this.client.chainId, Contracts.LOCKED_GOLD);

        transaction.toAddress = contractAddress;
        transaction.data = {
            method: 'lock',
            params: [tx.amount],
            raw: '0x' + abi.simpleEncode('lock()').toString('hex')
        };

        return transaction;
    }
}
