import { WalletType } from '../../core/wallet/types';
import { Blockchain } from '../../core/blockchain/types';
import BigNumber from 'bignumber.js';

export interface IWalletState {
    id: string;
    type: WalletType;
    accounts: IAccountState[];
    transactions?: {
        [hash: string]: ITransactionState;
    };
}

export interface IAccountState {
    index: number;
    blockchain: Blockchain;
    address: string;
    publicKey: string;
    nonce?: number;
    balance?: {
        value: BigNumber;
        inProgress: boolean;
        timestamp: number;
    };
    balanceTimestamp?: number;
}

export interface ITransactionState {
    id: string;
    date: Date;
    fromAddress: string;
    toAddress: string;
    amount: BigNumber;
    feeOptions: IFeeOptionsState;
    block: number;
    nonce: number;
}

export interface IFeeOptionsState {
    gasPrice: number;
    gasLimit: number;
    usedGas: number;
}
