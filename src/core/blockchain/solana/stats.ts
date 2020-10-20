import { IAccountState, ITokenState } from '../../../redux/wallets/state';
import { ApiClient } from '../../utils/api-client/api-client';
import { GenericStats, AccountStats } from '../types/stats';
import { Client } from './client';

export class Stats extends GenericStats<Client> {
    public async getAccountDelegateStats(
        account: IAccountState,
        token: ITokenState
    ): Promise<AccountStats> {
        const data = await new ApiClient().validators.getAccountDelegateStats(
            account,
            this.client.chainId.toString()
        );

        return data;
    }
}
