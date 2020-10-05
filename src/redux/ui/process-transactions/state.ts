import { IBlockchainTransaction } from '../../../core/blockchain/types';
import { IAccountState } from '../../wallets/state';

export interface IProcessTransactionsState {
    isVisible: boolean;
    data: {
        txs: IBlockchainTransaction[];
        createAccount: IAccountState;
    };
}
