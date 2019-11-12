import BigNumber from 'bignumber.js';

export interface IBlockchainTransactionUtils<TxOptions = any> {
    sign(transaction: IBlockchainTransaction<TxOptions>, privateKey: string): Promise<string>;
}

export interface IBlockchainTransaction<TxOptions = any> {
    from: string;
    to: string;
    amount: BigNumber;
    options: TxOptions;
}
