import { IBlockchainTransaction } from '../../../core/blockchain/types';

export interface IProcessTransactionsState {
    isVisible: boolean;
    data: {
        txs: IBlockchainTransaction[];
        tokenSymbol: string;
    };
}
