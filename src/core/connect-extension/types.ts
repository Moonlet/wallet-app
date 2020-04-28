import { ChainIdType } from '../blockchain/types';

export interface IStorage {
    version: number;
    state: {
        wallets: IStorageWallets;
        contacts: IStorageContact[];
        preferences: IStoragePreferences;
        tokens: IStorageTokens;
    };
}

export interface IStorageWallets {
    [walletId: string]: {
        name: string;
        type: string; // WalletType
        hwOptions?: {
            // ??
            deviceId: string;
            deviceVendor: string; // HWVendor;
            deviceModel: string; // HWModel;
        };
        accounts: {
            index: string;
            name: string;
            address: string;
            publicKey: string;
            tokens: {
                [chainId: string]: string[]; // array of symbols
            };
        }[];
        transactions: string[];
    };
}

export interface IStorageTokens {
    [blockchain: string]: {
        [chainId: string]: {
            [symbol: string]: {
                type: string;
                symbol: string;
                contract: string;
            };
        };
    }[];
}

export interface IStorageContact {
    blockchain: string;
    name: string;
    address: string;
}

export interface IStoragePreferences {
    currency: string;
    testnet: boolean;
    networks: IStorageNetworks;
    blockchains: string[];
}

export interface IStorageNetworks {
    [blockchain: string]: {
        // key is for Blockchain enum
        mainNet?: ChainIdType;
        testNet?: ChainIdType;
    };
}
