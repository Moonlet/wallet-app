import { Client } from '../client';
// import abi from 'ethereumjs-abi';
import { getContract } from './base-contract';
import { Contracts } from '../config';
// import { IPosTransaction, IBlockchainTransaction, TransactionType } from '../../types';

export class Accounts {
    constructor(private client: Client) {}

    public async isRegisteredAccount(accountAddress: string): Promise<boolean> {
        const contractAddress = await getContract(this.client.chainId, Contracts.ACCOUNTS);

        return this.client
            .callContract(contractAddress, 'isAccount(address):(bool)', [accountAddress])
            .then(res => {
                return Boolean(res);
            })
            .catch(() => {
                return false;
            });
    }
}
