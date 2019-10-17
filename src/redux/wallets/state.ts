import { WalletType } from '../../core/wallet/types';
import { Blockchain } from '../../core/blockchain/types';

export interface IWalletState {
    id: string;
    type: WalletType;
    accounts: IAccountState[];
    transactions?: Map<string, ITransactionState>;
}

export interface IAccountState {
    index: number;
    blockchain: Blockchain;
    address: string;
    publicKey: string;
    nonce?: number;
    balance?: number; // bignumber
    transactions?: string[];
}

export interface ITransactionState {
    id: string;
    date: Date;
    fromAddress: string;
    toAddress: string;
    amount: number; // bignumber
    feeOptions: IFeeOptionsState;
    block: number;
    nonce: number;
}

export interface IFeeOptionsState {
    gasPrice: number;
    gasLimit: number;
    usedGas: number;
}
