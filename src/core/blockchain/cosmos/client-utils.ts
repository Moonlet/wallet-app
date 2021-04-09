import { ITokenConfigState } from '../../../redux/tokens/state';
import { TransactionStatus } from '../../wallet/types';
import { IClientUtils } from '../types/client-utils';

export class ClientUtils implements IClientUtils {
    getTransaction(hash: string): Promise<import('../types').IBlockchainTransaction<any>> {
        throw new Error('Method not implemented.');
    }

    // TODO: fix this in order to use Sign Transaction(s) Screen
    async getTransactionStatus(
        hash: string,
        context: { txData?: any; currentBlockNumber?: number; token?: ITokenConfigState }
    ): Promise<TransactionStatus> {
        return Promise.reject('Cosmos ClientUtils.getTransactionStatus() not impelmented');
    }
}
