import BigNumber from 'bignumber.js';
import { IAccountState } from '../../../redux/wallets/state';

export interface IBlockchainTransactionUtils<TxOptions = any> {
    sign(transaction: IBlockchainTransaction<TxOptions>, privateKey: string): Promise<string>;
    buildTransferTransaction(tx: ITransferTransaction): IBlockchainTransaction<TxOptions>;
}

export interface IBlockchainTransaction<TxOptions = any> {
    from: string;
    to: string;
    amount: BigNumber;
    options: TxOptions;
}

export interface ITransferTransaction {
    chainId: number;
    account: IAccountState;
    toAddress: string;
    amount: BigNumber;
    token: string;
    nonce: number;
    gasPrice: BigNumber;
    gasLimit: number;
}
