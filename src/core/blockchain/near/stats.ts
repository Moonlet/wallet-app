import { GenericStats, AccountStats } from '../types/stats';
import { Client } from './client';
import { IAccountState, ITokenState } from '../../../redux/wallets/state';
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

        let availableToDelegate = new BigNumber(data.balance.unstaked);
        if (new BigNumber(data.balace.available).gt(config.amountToKeepInAccount)) {
            availableToDelegate = availableToDelegate.plus(
                new BigNumber(data.balance.available).minus(config.amountToKeepInAccount)
            );
        }
        return availableToDelegate.toFixed();
    }
}
