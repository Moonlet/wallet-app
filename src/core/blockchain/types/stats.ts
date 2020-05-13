import { IBlockchainConfig } from './config';
import { BlockchainGenericClient } from './client';
import { Blockchain } from './blockchain';

export enum IStatValueType {
    STRING = 'STRING',
    AMOUNT = 'AMOUNT'
}

export interface IStatValue {
    title: string;
    subtitle?: string;
    color: string;
    type: IStatValueType;
    data: {
        value: string;
        tokenSymbol?: string;
        blockchain?: Blockchain;
    };
}

export interface AccountStats {
    topStats: IStatValue[];
    chartStats: IStatValue[];
    secondaryStats: IStatValue[];
}

export abstract class GenericStats<Client = BlockchainGenericClient> {
    protected client: Client;
    protected config: IBlockchainConfig;
    constructor(client: Client, config: IBlockchainConfig) {
        this.client = client;
        this.config = config;
    }

    public getAccountDelegateStats(): AccountStats {
        throw new Error('Not Implemented');
    }
}

export enum CardActionType {
    CHECKBOX = 'CHECKBOX',
    NAVIGATE = 'CHECKBOX'
}

export interface IValidatorCard {
    icon: string;
    labelName: string;
    rank: string;
    totalLabel: string;
    website: string;
    rightTitle: string;
    rightSubtitle: string;
    actionType: CardActionType;
    bottomStats: IStatValue[];
}
