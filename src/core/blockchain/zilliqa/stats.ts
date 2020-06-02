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
        color: '#AB7361',
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

const moonletCardStats = [
    {
        title: 'Self Stake',
        color: '#FFFFFF',
        type: IStatValueType.STRING,
        data: {
            value: '0.41%'
        }
    },
    {
        title: 'Total Stakes',
        color: '#FFFFFF',
        type: IStatValueType.STRING,
        data: {
            value: '90.00%'
        }
    },
    {
        title: 'Commission',
        color: '#FFFFFF',
        type: IStatValueType.STRING,
        data: {
            value: '10.99%'
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
        title: 'Self Stake',
        color: '#FFFFFF',
        type: IStatValueType.STRING,
        data: {
            value: '0.33%'
        }
    },
    {
        title: 'Total Stakes',
        color: '#FFFFFF',
        type: IStatValueType.STRING,
        data: {
            value: '90.00%'
        }
    },
    {
        title: 'Commission',
        color: '#FFFFFF',
        type: IStatValueType.STRING,
        data: {
            value: '10.99%'
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
