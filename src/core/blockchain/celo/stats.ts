import { GenericStats, AccountStats } from '../types/stats';
import { Client } from './client';
import { Contracts } from './config';
import { IAccountState } from '../../../redux/wallets/state';
import { ApiClient } from '../../utils/api-client/api-client';
// import BigNumber from 'bignumber.js';

export class Stats extends GenericStats<Client> {
    public async getAccountDelegateStats(account: IAccountState): Promise<AccountStats> {
        const data = await new ApiClient().validators.getAccountDelegateStats(
            account,
            this.client.chainId.toString()
        );

        return data;
    }

    public async getValidatorsAddressVotedByAccount(account: IAccountState): Promise<string[]> {
        return this.client.contracts[Contracts.ELECTION].getGroupsVotedForByAccount(
            account.address
        );
    }
}
