import BigNumber from 'bignumber.js';
import { AccountType, IAccountState, ITokenState } from '../../../redux/wallets/state';
import { ApiClient } from '../../utils/api-client/api-client';
import { GenericStats, AccountStats } from '../types/stats';
import { Client } from './client';
import { config } from './config';

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

    public async getAvailableBalanceForDelegate(account: IAccountState): Promise<string> {
        const data = await new ApiClient().validators.getBalance(
            account.address,
            account.blockchain,
            this.client.chainId.toString()
        );

        let availableToDelegate = new BigNumber(0);
        const accountType = account?.type || AccountType.DEFAULT;

        if (new BigNumber(data.balance.available).gt(config.amountToKeepInAccount[accountType])) {
            availableToDelegate = availableToDelegate.plus(
                new BigNumber(data.balance.available).minus(
                    config.amountToKeepInAccount[accountType]
                )
            );
        }
        return availableToDelegate.toFixed();
    }
}
