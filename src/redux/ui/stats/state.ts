import { AccountStats } from '../../../core/blockchain/types/stats';

export interface IStatsState {
    [blockchain: string]: {
        [chainId: string]: {
            [address: string]: AccountStats;
        };
    };
}
