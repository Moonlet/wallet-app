import { ITokenConfigState } from '../../../redux/tokens/state';
import { TransactionStatus } from '../../wallet/types';
import { IBlockchainTransaction } from './transaction';

export interface IClientUtils {
    getTransaction(hash: string, options?: { address?: string }): Promise<IBlockchainTransaction>;
    getTransactionStatus(
        hash: string,
        context?: {
            txData?: any;
            broadcastedOnBlock: number;
            currentBlockNumber?: number;
            token?: ITokenConfigState;
        }
    ): Promise<TransactionStatus>;
}
