import { Blockchain, IBlockchainTransaction } from '../blockchain/types';
import { IAccountState } from '../../redux/wallets/state';

export enum WalletType {
    HD = 'HD',
    HW = 'HW'
}

export enum TransactionStatus {
    CREATED = 'CREATED',
    SIGNED = 'SIGNED',
    PENDING = 'PENDING',
    FAILED = 'FAILED',
    DROPPED = 'DROPPED',
    SUCCESS = 'SUCCESS'
}

export interface IWallet {
    getAccounts(blockchain: Blockchain, index: number, indexTo?: number): Promise<IAccountState[]>;
    sign(blockchain: Blockchain, accountIndex: number, tx: IBlockchainTransaction): Promise<string>;
    getPrivateKey(blockchain: Blockchain, accountIndex: number): string;
    getWalletCredentials(): Promise<{ publicKey: string; privateKey: string }>;
}
