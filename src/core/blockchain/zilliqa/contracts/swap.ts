import { Client } from '../client';
import { Contracts } from '../config';
import { getContract } from './base-contract';

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
}
