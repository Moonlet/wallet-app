import { IBlockchainConfig } from './config';
import { BlockchainGenericClient } from './client';
import { IAccountState, ITokenState } from '../../../redux/wallets/state';
import { AccountStats } from '../../../redux/ui/stats/state';

export abstract class GenericStats<Client = BlockchainGenericClient> {
    protected client: Client;
    protected config: IBlockchainConfig;
    constructor(client: Client, config: IBlockchainConfig) {
        this.client = client;
        this.config = config;
    }

    public async getAccountDelegateStats(
        account: IAccountState,
        token: ITokenState
    ): Promise<AccountStats> {
        throw new Error('Not Implemented');
    }

    public async getAvailableBalanceForDelegate(account: IAccountState): Promise<string> {
        throw new Error('Not Implemented');
    }
}
