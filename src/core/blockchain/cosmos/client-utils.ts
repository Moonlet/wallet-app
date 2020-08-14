import { IClientUtils } from '../types/client-utils';

export class ClientUtils implements IClientUtils {
    getTransaction(hash: string): Promise<import('../types').IBlockchainTransaction<any>> {
        throw new Error('Method not implemented.');
    }
}
