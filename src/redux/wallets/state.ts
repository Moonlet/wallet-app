import { WalletType } from '../../core/wallet/types';
import { Blockchain, IBlockchainTransaction } from '../../core/blockchain/types';
import { HWVendor, HWModel, HWConnection } from '../../core/wallet/hw-wallet/types';

export interface IWalletsState {
    [id: string]: IWalletState;
}

export interface IWalletState {
    id: string;
    name: string;
    deviceId?: string;
    selected: boolean;
    selectedBlockchain: Blockchain;
    hwOptions?: {
        deviceId: string;
        deviceVendor: HWVendor;
        deviceModel: HWModel;
        connectionType: HWConnection;
    };
    type: WalletType;
    accounts: IAccountState[];
    transactions?: {
        [id: string]: IBlockchainTransaction;
    };
}

export interface ITokensAccountState {
    [chainId: string]: {
        [symbol: string]: ITokenState;
    };
}

export interface IAccountState {
    index: number;
    selected: boolean;
    name?: string;
    blockchain: Blockchain;
    address: string;
    publicKey: string;
    nonce?: number;
    tokens: ITokensAccountState;
}

export interface ITokenState {
    symbol: string;
    order: number;
    active: boolean;
    balance?: {
        value: string;
        inProgress: boolean;
        timestamp: number;
        error: any;
    };
}
