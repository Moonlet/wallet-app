import { GenericStats, AccountStats } from '../types/stats';
import { Client } from './client';

export class Stats extends GenericStats<Client> {
    public async getAccountDelegateStats(): Promise<AccountStats> {
        throw new Error('Not Implemented');
    }
}
