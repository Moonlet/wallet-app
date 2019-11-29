import { Blockchain } from '../../core/blockchain/types';

export interface IContactState {
    blockchain: Blockchain;
    name: string;
    address: string;
}

export interface IContactsState {
    [key: string]: IContactState; // key = `${blockchain}|${address}`;
}
