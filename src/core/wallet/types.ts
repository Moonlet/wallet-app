import { Blockchain, IBlockchainTransaction } from '../blockchain/types';
import { IAccountState } from '../../redux/wallets/state';

export enum WalletType {
    HD = 'HD',
    HW_LEDGER = 'HW_LEDGER'
}

export enum TransactionStatus {
    Pending = 'Pending',
    Failed = 'Failed',
    Dropped = 'Dropped',
    Success = 'Success'
}

export interface IWallet {
    getAccounts(blockchain: Blockchain, index: number, indexTo: number): Promise<IAccountState[]>;
    sign(blockchain: Blockchain, accountIndex: number, tx: IBlockchainTransaction): Promise<string>;
}
