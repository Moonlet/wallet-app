import { ChainIdType } from '../blockchain/types';
import { HWConnection } from '../wallet/hw-wallet/types';

export interface IQRCodeConn {
    connectionId: string;
    encKey: string;
    os?: string;
    platform?: string;
}

export enum FirebaseRef {
    EXTENSION_SYNC = 'extensionSync',
    CONNECTIONS = 'connections'
}

export const FIREBASE_BUCKET = 'gs://moonlet-extension-sync';

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
    [walletId: string]: IStorageWallet;
}

export interface IStorageWallet {
    name: string;
    type: string; // WalletType
    hwOptions?: {
        // ??
        deviceId: string;
        deviceVendor: string; // HWVendor;
        deviceModel: string; // HWModel;
        connectionType: HWConnection;
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
}

export interface IStorageTokens {
    [blockchain: string]: {
        [chainId: string]: {
            [symbol: string]: {
                type: string;
                symbol: string;
                contractAddress: string;
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
