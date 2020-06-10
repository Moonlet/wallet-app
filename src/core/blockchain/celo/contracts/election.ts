import { Client } from '../client';
import { IPosTransaction, IBlockchainTransaction } from '../../types';
import abi from 'ethereumjs-abi';
import { getContract, buildBaseTransaction } from './base-contract';
import { Contracts } from '../config';

export class Election {
    constructor(private client: Client) {}

    public async vote(tx: IPosTransaction): Promise<IBlockchainTransaction> {
        const transaction = await buildBaseTransaction(tx);
        const contractAddress = await getContract(this.client.chainId, Contracts.ELECTION);

        transaction.toAddress = contractAddress;
        // TODO - devs - ignore this - continuing in next PR
        transaction.data = {
            method: 'vote',
            params: [tx.amount],
            raw: '0x' + abi.simpleEncode('vote()').toString('hex')
        };

        return transaction;
    }
}
