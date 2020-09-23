import { GenericStats } from '../types/stats';
import { Client } from './client';
import { IAccountState, ITokenState } from '../../../redux/wallets/state';
import { ApiClient } from '../../utils/api-client/api-client';
import { BigNumber } from 'bignumber.js';
import { AccountStats } from '../../../redux/ui/stats/state';

export class Stats extends GenericStats<Client> {
    public async getAccountDelegateStats(
        account: IAccountState,
        token: ITokenState
    ): Promise<AccountStats> {
        return new ApiClient().validators.getAccountDelegateStats(
            account,
            this.client.chainId.toString()
        );
    }

    public async getAvailableBalanceForDelegate(account: IAccountState): Promise<string> {
        const data = await new ApiClient().validators.getBalance(
            account,
            this.client.chainId.toString()
        );

        return new BigNumber(data.balance.available)
            .plus(new BigNumber(data.balance.nonVotingLockedGold))
            .minus(new BigNumber(data.balance.pendingActivationGold))
            .toFixed();
    }
}
