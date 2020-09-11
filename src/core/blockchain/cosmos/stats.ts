import { GenericStats, IStatValueType, AccountStats, IValidator } from '../types/stats';
import { Client } from './client';
import { Blockchain } from '../types/blockchain';
import BigNumber from 'bignumber.js';
import { IAccountState, ITokenState } from '../../../redux/wallets/state';

export class Stats extends GenericStats<Client> {
    public async getAccountDelegateStats(
        account: IAccountState,
        token: ITokenState
    ): Promise<AccountStats> {
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
        chartDisplay: true,
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
        chartDisplay: true,
        data: {
            value: '10000.00',
            tokenSymbol: 'ATOM',
            blockchain: Blockchain.COSMOS
        }
    },
    {
        title: 'Undelegated',
        color: '#FFAB91',
        type: IStatValueType.AMOUNT,
        chartDisplay: true,
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
        chartDisplay: true,
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

export const moonletValidator: IValidator = {
    id: 'moonletID',
    icon: 'https://thecelo.com/logos/0x8851f4852ce427191dc8d9065d720619889e3260.jpg',
    name: 'Moonlet',
    rank: '10th',
    totalVotes: '120000',
    amountDelegated: {
        pending: '0',
        active: '0'
    },
    website: 'http://moonlet.io',
    topStats: topStatsValues,
    secondaryStats: secondaryStatsValues,
    chartStats: chartStatsValues
};

export const chainLayerValidator: IValidator = {
    id: 'chainLayerId',
    icon: 'https://thecelo.com/logos/0x4fc4ea624db2e4a1d6195a03744d505cbcd9431b.jpg',
    name: 'ChainLayer',
    rank: '10th',
    totalVotes: '220000',
    amountDelegated: {
        pending: '0',
        active: '0'
    },
    website: 'http://chainlayer.io',
    topStats: topStatsValues,
    secondaryStats: secondaryStatsValues,
    chartStats: chartStatsValues
};
