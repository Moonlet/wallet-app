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

    public async getAccountDelegateStats(): Promise<AccountStats> {
        throw new Error('Not Implemented');
    }
}

export enum CardActionType {
    CHECKBOX = 'CHECKBOX',
    NAVIGATE = 'NAVIGATE'
}

export interface IValidatorCard {
    icon: string;
    leftLabel: string;
    leftSmallLabel: string;
    leftSubLabel: string;
    rightTitle: string;
    rightSubtitle: string;
    actionType: CardActionType;
    cardStats: IStatValue[];
}

export interface IValidator {
    id: string;
    icon: string;
    name: string;
    rank: string;
    website: string;
    totalAmountStd: string;
    bottomStats: IStatValue[];
}
