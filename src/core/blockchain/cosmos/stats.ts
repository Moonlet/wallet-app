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
        label: 'Daily',
        color: '#6A6A6A',
        type: IStatValueType.AMOUNT,
        data: {
            value: '0.1200000',
            tokenSymbol: 'ATOM',
            blockchain: Blockchain.COSMOS
        }
    },
    {
        label: 'Monthly',
        color: '#6A6A6A',
        type: IStatValueType.AMOUNT,
        data: {
            value: '3.60000',
            tokenSymbol: 'ATOM',
            blockchain: Blockchain.COSMOS
        }
    },
    {
        label: 'Yearly',
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
        label: 'Available',
        color: '#FFFFFF',
        type: IStatValueType.AMOUNT,
        data: {
            value: '1000.00',
            tokenSymbol: 'ATOM',
            blockchain: Blockchain.COSMOS
        }
    },
    {
        label: 'Delegated',
        color: '#00DAFF',
        type: IStatValueType.AMOUNT,
        data: {
            value: '10000.00',
            tokenSymbol: 'ATOM',
            blockchain: Blockchain.COSMOS
        }
    },
    {
        label: 'Undelegated',
        color: '#AB7361',
        type: IStatValueType.AMOUNT,
        data: {
            value: '1500.00',
            tokenSymbol: 'ATOM',
            blockchain: Blockchain.COSMOS
        }
    },
    {
        label: 'Reward',
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
        label: 'No. of Validators',
        color: '#FFFFFF',
        type: IStatValueType.STRING,
        data: {
            value: '4'
        }
    },
    {
        label: 'Avg. Commission',
        color: '#FFFFFF',
        type: IStatValueType.STRING,
        data: {
            value: '10.00%'
        }
    },
    {
        label: 'Avg. Reward',
        color: '#00E676',
        type: IStatValueType.STRING,
        data: {
            value: '8.64%'
        }
    }
];
