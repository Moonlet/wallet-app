import {
    GenericStats,
    IStatValueType,
    AccountStats,
    IValidator,
    CardActionType
} from '../types/stats';
import { Client } from './client';
import { Blockchain } from '../types/blockchain';

export class Stats extends GenericStats<Client> {
    public async getAccountDelegateStats(): Promise<AccountStats> {
        return {
            topStats: topStatsValues,
            chartStats: chartStatsValues,
            secondaryStats: secondaryStatsValues
        };
    }
    public async getValidatorList(
        actionType: CardActionType,
        nrValidators: number
    ): Promise<IValidator[]> {
        moonletValidator.actionType = actionType;
        chainLayerValidator.actionType = actionType;

        if (nrValidators === -1)
            return [
                moonletValidator,
                chainLayerValidator,
                moonletValidator,
                moonletValidator,
                chainLayerValidator
            ];

        // used for redelegate
        if (nrValidators === 7) return [chainLayerValidator];

        // DUMMY DATA
        if (nrValidators === 1) return [moonletValidator2];
        if (nrValidators === 2) return [moonletValidator, chainLayerValidator];
        else return [moonletValidator, chainLayerValidator, moonletValidator];
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
        chartDisplay: true,
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
        chartDisplay: true,
        data: {
            value: '20000.00',
            tokenSymbol: 'cGLD',
            blockchain: Blockchain.CELO
        }
    },
    {
        title: 'Not-Voting',
        subtitle: 'locked',
        color: '#E91E63',
        chartDisplay: false,
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
        chartDisplay: true,
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
        chartDisplay: true,
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

const moonletCardStats = [
    {
        title: 'Validators',
        color: '#FFFFFF',
        type: IStatValueType.STRING,
        data: {
            value: '2/2'
        }
    },
    {
        title: 'Voting Power',
        color: '#FFFFFF',
        type: IStatValueType.STRING,
        data: {
            value: '0.64%'
        }
    },
    {
        title: 'Uptime',
        color: '#FFFFFF',
        type: IStatValueType.STRING,
        data: {
            value: '99.99%'
        }
    },
    {
        title: 'Reward',
        color: '#00E676',
        type: IStatValueType.STRING,
        data: {
            value: '8.64%'
        }
    }
];

export const moonletValidator2: IValidator = {
    id: 'moonletID2',
    icon: 'https://thecelo.com/logos/0x8851f4852ce427191dc8d9065d720619889e3260.jpg',
    name: 'Moonlet',
    rank: '10th',
    amountDelegated: '23',
    website: 'http://moonlet.io',
    topStats: moonletCardStats,
    secondaryStats: secondaryStatsValues,
    chartStats: chartStatsValues,
    cardStats: moonletCardStats
};
export const moonletValidator: IValidator = {
    id: 'moonletID',
    icon: 'https://thecelo.com/logos/0x8851f4852ce427191dc8d9065d720619889e3260.jpg',
    name: 'Moonlet',
    rank: '10th',
    amountDelegated: '23',
    website: 'http://moonlet.io',
    topStats: moonletCardStats,
    secondaryStats: secondaryStatsValues,
    chartStats: chartStatsValues,
    cardStats: moonletCardStats
};

const chainLayerCardStats = [
    {
        title: 'Validators',
        color: '#FFFFFF',
        type: IStatValueType.STRING,

        data: {
            value: '3/3'
        }
    },
    {
        title: 'Voting Power',
        color: '#FFFFFF',
        type: IStatValueType.STRING,
        data: {
            value: '0.64%'
        }
    },
    {
        title: 'Uptime',
        color: '#FFFFFF',
        type: IStatValueType.STRING,
        data: {
            value: '99.99%'
        }
    },
    {
        title: 'Reward',
        color: '#00E676',
        type: IStatValueType.STRING,
        data: {
            value: '8.64%'
        }
    }
];

export const chainLayerValidator: IValidator = {
    id: 'chainLayerID',
    icon: 'https://thecelo.com/logos/0x4fc4ea624db2e4a1d6195a03744d505cbcd9431b.jpg',
    name: 'ChainLayer',
    rank: '10th',
    amountDelegated: '190000',
    website: 'http://chainlayer.io',
    topStats: chainLayerCardStats,
    chartStats: chartStatsValues,
    secondaryStats: secondaryStatsValues,
    cardStats: chainLayerCardStats
};
