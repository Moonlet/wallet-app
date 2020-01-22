import { Blockchain } from '../../core/blockchain/types';

export interface ICurrentAccount {
    index: number;
    blockchain: Blockchain;
}

export interface IAppState {
    version: number;
    selectedWalletId: string;
    selectedBlockchain: Blockchain;
    tosVersion: number;
}
