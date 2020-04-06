import { IBlockchainTransaction } from './transaction';

export interface IClientUtils {
    getTransaction(hash: string): Promise<IBlockchainTransaction>;
}
