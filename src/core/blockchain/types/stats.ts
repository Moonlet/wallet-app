import { IBlockchainConfig } from './config';
import { BlockchainGenericClient } from './client';
import { Blockchain } from './blockchain';

export enum IStatValueType {
    STRING = 'STRING',
    AMOUNT = 'AMOUNT'
}

export interface IStatValue {
    label: string;
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
