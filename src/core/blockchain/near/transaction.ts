import { IBlockchainTransaction, ITransferTransaction } from '../types';
import { INearTxOptions } from '.';

// TODO: this part is in refactoring...
export const sign = async (
    tx: IBlockchainTransaction<INearTxOptions>,
    privateKey: string
): Promise<any> => {
    throw new Error('not implemented');
};

export const buildTransferTransaction = (
    tx: ITransferTransaction
): IBlockchainTransaction<INearTxOptions> => {
    throw new Error('not implemented');
};
