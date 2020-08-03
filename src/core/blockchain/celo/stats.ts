import { GenericStats, AccountStats, IStatValueType } from '../types/stats';
import { Client } from './client';
import { Contracts } from './config';
import { IAccountState, ITokenState } from '../../../redux/wallets/state';
import { ApiClient } from '../../utils/api-client/api-client';
import BigNumber from 'bignumber.js';
import { Blockchain } from '../types';

export class Stats extends GenericStats<Client> {
    public async getAccountDelegateStats(
        account: IAccountState,
        token: ITokenState
    ): Promise<AccountStats> {
        const data = await new ApiClient().validators.getAccountDelegateStats(
            account,
            this.client.chainId.toString()
        );

        if (data === undefined) {
            // get balance if
            let stats = {
                topStats: [],
                chartStats: [],
                secondaryStats: [],
                totalAmount: new BigNumber(0),
                widgets: []
            };

            if (new BigNumber(token.balance?.value).isGreaterThan(0)) {
                stats = {
                    ...stats,
                    chartStats: [
                        {
                            title: 'Available',
                            color: '#FFFFFF',
                            type: IStatValueType.AMOUNT,
                            chartDisplay: true,
                            data: {
                                value: token.balance?.value,
                                tokenSymbol: 'CELO',
                                blockchain: Blockchain.CELO
                            }
                        }
                    ]
                };
            }

            return stats;
        }

        return data;
    }

    public async getValidatorsAddressVotedByAccount(account: IAccountState): Promise<string[]> {
        return this.client.contracts[Contracts.ELECTION].getGroupsVotedForByAccount(
            account.address
        );
    }
}
