import { ChainIdType, Blockchain } from '../blockchain/types';
import { HWConnection } from '../wallet/hw-wallet/types';
import { WalletType } from '../wallet/types';
import { TokenType } from '../blockchain/types/token';

export interface IQRCodeConn {
    connectionId: string;
    encKey: string;
    os?: string;
    platform?: string;
}

export enum FirebaseRef {
    EXTENSION_SYNC = 'extensionSync',
    CONNECTIONS = 'connections',
    REQUESTS = 'requests'
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
    selected: boolean;
    selectedBlockchain: Blockchain;
    type: WalletType;
    hwOptions?: {
        // ??
        deviceId: string;
        deviceVendor: string; // HWVendor;
        deviceModel: string; // HWModel;
        connectionType: HWConnection;
    };
    accounts: {
        index: number;
        selected: boolean;
        name?: string;
        blockchain: Blockchain;
        address: string;
        publicKey: string;
        nonce?: number;
        tokens: {
            [chainId: string]: string[]; // array of symbols
        };
    }[];
    transactions: {
        [txHash: string]: {
            blockchain: Blockchain;
            chainId: ChainIdType;
            broadcastedOnBlock: number;
        };
    };
}

export interface IStorageToken {
    type: TokenType;
    symbol: string;
    contractAddress: string;
    removable: boolean;
}

export interface IStorageTokens {
    [blockchain: string]: {
        [chainId: string]: {
            [symbol: string]: {
                type: string;
                symbol: string;
                contractAddress: string;
                removable: boolean;
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
    testNet: boolean;
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
