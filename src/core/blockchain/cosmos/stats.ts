import { GenericStats } from '../types/stats';
import { Client } from './client';
import { Blockchain } from '../types/blockchain';
import BigNumber from 'bignumber.js';
import { IAccountState, ITokenState } from '../../../redux/wallets/state';
import { IconValues } from '../../../components/icon/values';
import {
    AccountStats,
    IStatValueType,
    IStatValue,
    IValidator
} from '../../../redux/ui/stats/state';

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

export const chartStatsValues: IStatValue[] = [
    {
        title: 'Available',
        color: '#9A99A2',
        type: IStatValueType.AMOUNT,
        icon: IconValues.MONEY_WALLET,
        data: {
            value: '1000.00',
            tokenSymbol: 'ATOM',
            blockchain: Blockchain.COSMOS
        }
    },
    {
        title: 'Undelegated',
        color: '#FFAB91',
        type: IStatValueType.AMOUNT,
        icon: IconValues.KEY_LOCK,
        data: {
            value: '1500.00',
            tokenSymbol: 'ATOM',
            blockchain: Blockchain.COSMOS
        }
    },
    {
        title: 'Delegated',
        color: '#00DAFF',
        type: IStatValueType.AMOUNT,
        icon: IconValues.VOTE,
        data: {
            value: '10000.00',
            tokenSymbol: 'ATOM',
            blockchain: Blockchain.COSMOS
        }
    },
    {
        title: 'Reward',
        color: '#00E676',
        type: IStatValueType.AMOUNT,
        icon: IconValues.CLAIM_REWARD,
        data: {
            value: '700.00',
            tokenSymbol: 'ATOM',
            blockchain: Blockchain.COSMOS
        }
    }
];

export const topStatsValues: IStatValue[] = [
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
