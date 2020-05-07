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
            tokenSymbol: 'ATOM',
            blockchain: Blockchain.COSMOS
        }
    },
    {
        title: 'Monthly',
        color: '#6A6A6A',
        type: IStatValueType.AMOUNT,
        data: {
            value: '3.60000',
            tokenSymbol: 'ATOM',
            blockchain: Blockchain.COSMOS
        }
    },
    {
        title: 'Yearly',
        color: '#6A6A6A',
        type: IStatValueType.AMOUNT,
        data: {
            value: '43.200000',
            tokenSymbol: 'ATOM',
            blockchain: Blockchain.COSMOS
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
            tokenSymbol: 'ATOM',
            blockchain: Blockchain.COSMOS
        }
    },
    {
        title: 'Delegated',
        color: '#00DAFF',
        type: IStatValueType.AMOUNT,
        data: {
            value: '10000.00',
            tokenSymbol: 'ATOM',
            blockchain: Blockchain.COSMOS
        }
    },
    {
        title: 'Undelegated',
        color: '#AB7361',
        type: IStatValueType.AMOUNT,
        data: {
            value: '1500.00',
            tokenSymbol: 'ATOM',
            blockchain: Blockchain.COSMOS
        }
    },
    {
        title: 'Reward',
        color: '#00E676',
        type: IStatValueType.AMOUNT,
        data: {
            value: '700.00',
            tokenSymbol: 'ATOM',
            blockchain: Blockchain.COSMOS
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
