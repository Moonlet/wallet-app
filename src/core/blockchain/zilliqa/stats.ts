import { GenericStats, IStatValueType, AccountStats } from '../types/stats';
import { Client } from './client';
import { Blockchain } from '../types/blockchain';
import BigNumber from 'bignumber.js';

export class Stats extends GenericStats<Client> {
    public async getAccountDelegateStats(): Promise<AccountStats> {
        return {
            topStats: topStatsValues,
            chartStats: chartStatsValues,
            secondaryStats: secondaryStatsValues,
            totalAmount: new BigNumber(0),
            widgets: []
        };
    }
}

// dummy data for stats

export const secondaryStatsValues = [
    {
        title: 'Daily',
        color: '#6A6A6A',
        type: IStatValueType.AMOUNT,
        data: {
            value: '0.1200000',
            tokenSymbol: 'ZIL',
            blockchain: Blockchain.ZILLIQA
        }
    },
    {
        title: 'Monthly',
        color: '#6A6A6A',
        type: IStatValueType.AMOUNT,
        data: {
            value: '3.60000',
            tokenSymbol: 'ZIL',
            blockchain: Blockchain.ZILLIQA
        }
    },
    {
        title: 'Yearly',
        color: '#6A6A6A',
        type: IStatValueType.AMOUNT,
        data: {
            value: '43.200000',
            tokenSymbol: 'ZIL',
            blockchain: Blockchain.ZILLIQA
        }
    }
];

export const chartStatsValues = [
    {
        title: 'Available',
        color: '#FFFFFF',
        type: IStatValueType.AMOUNT,
        chartDisplay: true,
        data: {
            value: '1000.00',
            tokenSymbol: 'ZIL',
            blockchain: Blockchain.ZILLIQA
        }
    },

    {
        title: 'Staked',
        color: '#00DAFF',
        type: IStatValueType.AMOUNT,
        chartDisplay: true,
        data: {
            value: '20000.00',
            tokenSymbol: 'ZIL',
            blockchain: Blockchain.ZILLIQA
        }
    },
    {
        title: 'Unstaking',
        color: '#FFAB91',
        chartDisplay: true,
        type: IStatValueType.AMOUNT,
        data: {
            value: '10000.00',
            tokenSymbol: 'ZIL',
            blockchain: Blockchain.ZILLIQA
        }
    },
    {
        title: 'Reward',
        color: '#00E676',
        type: IStatValueType.AMOUNT,
        chartDisplay: true,
        data: {
            value: '700.00',
            tokenSymbol: 'ZIL',
            blockchain: Blockchain.ZILLIQA
        }
    }
];

export const topStatsValues = [
    {
        title: 'No. of Validators',
        color: '#FFFFFF',
        type: IStatValueType.STRING,
        data: {
            value: '4'
        }
    },
    {
        title: 'Avg. Commission',
        color: '#FFFFFF',
        type: IStatValueType.STRING,
        data: {
            value: '10.00%'
        }
    },
    {
        title: 'Avg. Reward',
        color: '#00E676',
        type: IStatValueType.STRING,
        data: {
            value: '8.64%'
        }
    }
];
