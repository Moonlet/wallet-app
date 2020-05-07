import { GenericStats, IStatValueType, AccountStats } from '../types/stats';
import { Client } from './client';
import { Blockchain } from '../types/blockchain';

export class Stats extends GenericStats<Client> {
    public getAccountDelegateStats(): AccountStats {
        return {
            topStats: topStatsValues,
            chartStats: chartStatsValues,
            secondaryStats: secondaryStatsValues
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
            tokenSymbol: 'cGLD',
            blockchain: Blockchain.CELO
        }
    },
    {
        title: 'Monthly',
        color: '#6A6A6A',
        type: IStatValueType.AMOUNT,
        data: {
            value: '3.60000',
            tokenSymbol: 'cGLD',
            blockchain: Blockchain.CELO
        }
    },
    {
        title: 'Yearly',
        color: '#6A6A6A',
        type: IStatValueType.AMOUNT,
        data: {
            value: '43.200000',
            tokenSymbol: 'cGLD',
            blockchain: Blockchain.CELO
        }
    }
];

export const chartStatsValues = [
    {
        title: 'Available',
        color: '#FFFFFF',
        type: IStatValueType.AMOUNT,
        data: {
            value: '1000.00',
            tokenSymbol: 'cGLD',
            blockchain: Blockchain.CELO
        }
    },

    {
        title: 'Voting',
        subtitle: 'locked',
        color: '#00DAFF',
        type: IStatValueType.AMOUNT,
        data: {
            value: '10000.00',
            tokenSymbol: 'cGLD',
            blockchain: Blockchain.CELO
        }
    },
    {
        title: 'Not-Voting',
        subtitle: 'locked',
        color: '#E91E63',
        type: IStatValueType.AMOUNT,
        data: {
            value: '10000.00',
            tokenSymbol: 'cGLD',
            blockchain: Blockchain.CELO
        }
    },
    {
        title: 'Unlocking',
        color: '#AB7361',
        type: IStatValueType.AMOUNT,
        data: {
            value: '1500.00',
            tokenSymbol: 'cGLD',
            blockchain: Blockchain.CELO
        }
    },
    {
        title: 'Reward',
        color: '#00E676',
        type: IStatValueType.AMOUNT,
        data: {
            value: '700.00',
            tokenSymbol: 'cGLD',
            blockchain: Blockchain.CELO
        }
    }
];

export const topStatsValues = [
    {
        title: 'No. of Groups',
        color: '#FFFFFF',
        type: IStatValueType.STRING,
        data: {
            value: '4'
        }
    },
    {
        title: 'Avg. Uptime',
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
