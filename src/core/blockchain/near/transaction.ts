import { IBlockchainTransaction, ITransferTransaction } from '../types';

// TODO: this part is in refactoring...
export const sign = async (tx: IBlockchainTransaction, privateKey: string): Promise<any> => {
    throw new Error('not implemented');
};

export const buildTransferTransaction = (tx: ITransferTransaction): IBlockchainTransaction => {
    throw new Error('not implemented');
};
