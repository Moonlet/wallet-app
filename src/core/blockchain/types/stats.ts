import { IBlockchainConfig } from './config';
import { BlockchainGenericClient } from './client';
import { Blockchain } from './blockchain';
import { PosBasicActionType } from './token';

export enum IStatValueType {
    STRING = 'STRING',
    AMOUNT = 'AMOUNT'
}

export interface IStatValue {
    title: string;
    subtitle?: string;
    color: string;
    type: IStatValueType;
    chartDisplay?: boolean;
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

    public async getValidatorList(
        actionType: CardActionType,
        numberValidators: number
    ): Promise<IValidator[]> {
        throw new Error('Not Implemented');
    }
}

export enum CardActionType {
    CHECKBOX = 'CHECKBOX',
    NAVIGATE = 'NAVIGATE',
    DEFAULT = 'DEFAULT'
}

export interface IValidator {
    id: string;
    icon: string;
    name: string;
    rank: string;
    website: string;
    amountDelegated: string;
    cardStats: IStatValue[];
    topStats: IStatValue[];
    chartStats: IStatValue[];
    secondaryStats: IStatValue[];
    actionType?: CardActionType;
    actionTypeSelected?: boolean;
}

export interface IPosWidget {
    type: PosBasicActionType;
    value: string;
    timestamp: string;
}
