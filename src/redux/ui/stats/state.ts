import BigNumber from 'bignumber.js';
import { Blockchain } from '../../../core/blockchain/types';
import { PosBasicActionType } from '../../../core/blockchain/types/token';

export interface IStatsState {
    [blockchain: string]: {
        [chainId: string]: {
            [address: string]: AccountStats;
        };
    };
}

export interface AccountStats {
    topStats: IStatValue[];
    chartStats: IStatValue[];
    secondaryStats: IStatValue[];
    totalAmount: BigNumber;
    widgets: IPosWidget[];
}

export interface IStatValue {
    title: string;
    subtitle?: string;
    color: string;
    type: IStatValueType;
    icon?: string;
    data: {
        value: string;
        tokenSymbol?: string;
        blockchain?: Blockchain;
    };
}

export enum IStatValueType {
    STRING = 'STRING',
    AMOUNT = 'AMOUNT'
}

export interface IValidator {
    id: string;
    icon: string;
    name: string;
    rank: string;
    website: string;
    totalVotes: string;
    amountDelegated: {
        pending: string;
        active: string;
    };
    topStats: IStatValue[];
    chartStats: IStatValue[];
    secondaryStats: IStatValue[];
    actionType?: CardActionType;
    actionTypeSelected?: boolean;
}

export enum CardActionType {
    CHECKBOX = 'CHECKBOX',
    NAVIGATE = 'NAVIGATE',
    DEFAULT = 'DEFAULT'
}

export interface IPosWidget {
    type: PosBasicActionType;
    value: string;
    timestamp: string;
    index?: number;
    validator?: {
        id: string;
        name: string;
    };
}
