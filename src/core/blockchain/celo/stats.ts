import { GenericStats, AccountStats } from '../types/stats';
import { Client } from './client';
import { Blockchain } from '../types/blockchain';
import { Contracts } from './config';
import { IAccountState } from '../../../redux/wallets/state';
// import BigNumber from 'bignumber.js';

export class Stats extends GenericStats<Client> {
    public async getAccountDelegateStats(account: IAccountState): Promise<AccountStats> {
        const result = await fetch('http://127.0.0.1:8080/wallet-ui/token-screen', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                blockchain: Blockchain.CELO,
                address: account.address,
                chainId: '44786'
            })
        });
        const response = await result.json();

        return response.result.data;
    }

    public async getValidatorsAddressVotedByAccount(account: IAccountState): Promise<string[]> {
        return this.client.contracts[Contracts.ELECTION].getGroupsVotedForByAccount(
            account.address
        );
    }
}
