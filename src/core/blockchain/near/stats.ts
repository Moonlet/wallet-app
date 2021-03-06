import { GenericStats, AccountStats } from '../types/stats';
import { Client } from './client';
import { AccountType, IAccountState, ITokenState } from '../../../redux/wallets/state';
import { ApiClient } from '../../utils/api-client/api-client';
import BigNumber from 'bignumber.js';
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

    public async getAvailableBalanceForDelegate(
        account: IAccountState,
        validatorId: string
    ): Promise<string> {
        const data = await new ApiClient().validators.getBalance(
            account.address,
            account.blockchain,
            this.client.chainId.toString(),
            validatorId
        );

        const unstaked = validatorId ? data.balance.unstaked : 0;

        let availableToDelegate = new BigNumber(unstaked || 0);

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
