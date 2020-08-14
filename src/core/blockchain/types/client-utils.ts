import { IBlockchainTransaction } from './transaction';

export interface IClientUtils {
    getTransaction(hash: string, address?: string): Promise<IBlockchainTransaction>;
}
