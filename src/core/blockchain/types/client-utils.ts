import { IBlockchainTransaction } from './transaction';
import { IAccountState } from '../../../redux/wallets/state';
import { IPosWidget } from './stats';

export interface IClientUtils {
    getTransaction(hash: string, address?: string): Promise<IBlockchainTransaction>;
    getWidgets(account: IAccountState): Promise<IPosWidget[]>;
}
