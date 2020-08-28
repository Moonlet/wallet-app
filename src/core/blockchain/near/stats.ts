import { GenericStats, AccountStats } from '../types/stats';
import { Client } from './client';
import { IAccountState, ITokenState } from '../../../redux/wallets/state';

export class Stats extends GenericStats<Client> {
    public async getAccountDelegateStats(
        account: IAccountState,
        token: ITokenState
    ): Promise<AccountStats> {
        throw new Error('Not Implemented');
    }
}
