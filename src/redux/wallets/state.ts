import { WalletType, TransactionStatus } from '../../core/wallet/types';
import { Blockchain } from '../../core/blockchain/types';
import BigNumber from 'bignumber.js';
import { HWVendor, HWModel, HWConnection } from '../../core/wallet/hw-wallet/types';
import { ITokenConfig } from '../../core/blockchain/types/token';

export interface IWalletsState {
    [id: string]: IWalletState;
}

export interface IWalletState {
    id: string;
    name: string;
    deviceId?: string;
    hwOptions?: {
        deviceId: string;
        deviceVendor: HWVendor;
        deviceModel: HWModel;
        connectionType: HWConnection;
    };
    type: WalletType;
    accounts: IAccountState[];
    transactions?: {
        [id: string]: ITransactionState;
    };
}

export enum TokenType {
    NATIVE = 'NATIVE',
    ERC20 = 'ERC20'
}

export interface IAccountState {
    index: number;
    name?: string;
    blockchain: Blockchain;
    address: string;
    publicKey: string;
    nonce?: number;
    tokens: {
        [symbol: string]: ITokenConfig;
    };
    balance?: any; // TODO: remove this, deprecated...
}

export interface ITransactionState {
    id: string;
    date: {
        created: number;
        signed: number;
        broadcasted: number;
        confirmed: number;
    };
    fromAddress: string;
    toAddress: string;
    amount: BigNumber;
    feeOptions: IFeeOptionsState;
    block: number;
    nonce: number;
    status: TransactionStatus;
}

export interface IFeeOptionsState {
    gasPrice: number;
    gasLimit: number;
    usedGas: number;
}
