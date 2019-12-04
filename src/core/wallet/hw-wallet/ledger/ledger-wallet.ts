import { IWallet } from '../../types';
import { Blockchain, IBlockchainTransaction } from '../../../blockchain/types';
import { IAccountState } from '../../../../redux/wallets/state';
import { HWModel, HWConnection } from '../types';

export class LedgerWallet implements IWallet {
    constructor(transport: Transport) {
        //
    }
    public getAccounts(
        blockchain: Blockchain,
        index: number,
        indexTo?: number
    ): Promise<IAccountState[]> {
        return;
    }
    public async sign(
        blockchain: Blockchain,
        accountIndex: number,
        tx: IBlockchainTransaction
    ): Promise<any> {
        return;
    }
}
