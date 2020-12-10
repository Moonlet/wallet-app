import { Blockchain, IBlockchainTransaction } from '../blockchain/types';
import { AccountType, IAccountState } from '../../redux/wallets/state';

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
    getAccounts(
        blockchain: Blockchain,
        accountType: AccountType,
        index: number,
        indexTo?: number
    ): Promise<IAccountState[]>;
    sign(
        blockchain: Blockchain,
        accountIndex: number,
        tx: IBlockchainTransaction,
        accountType: AccountType
    ): Promise<string>;
    signMessage(
        blockchain: Blockchain,
        accountIndex: number,
        accountType: AccountType,
        message: string
    ): Promise<string>;
    getPrivateKey(blockchain: Blockchain, accountIndex: number, accountType: AccountType): string;
    getWalletCredentials(): Promise<{ publicKey: string; privateKey: string }>;
}
