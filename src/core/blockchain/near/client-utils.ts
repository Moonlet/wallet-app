import { IClientUtils } from '../types/client-utils';
import { IAccountState } from '../../../redux/wallets/state';
import { IPosWidget } from '../types/stats';

export class ClientUtils implements IClientUtils {
    getTransaction(hash: string): Promise<import('../types').IBlockchainTransaction<any>> {
        throw new Error('Method not implemented.');
    }
    getWidgets(account: IAccountState): Promise<IPosWidget[]> {
        throw new Error('Method not implemented.');
    }
}
