import { IBlockchainTransaction } from './transaction';

export interface IClientUtils {
    getTransaction(hash: string, options?: { address?: string }): Promise<IBlockchainTransaction>;
}
