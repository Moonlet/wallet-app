import { Blockchain } from '../../../core/blockchain/types';
import { HWConnection, HWModel } from '../../../core/wallet/hw-wallet/types';

export interface ILedgerConnectState {
    displayLedgerConnect: boolean;
    blockchain: Blockchain;
    deviceModel: HWModel;
    connectionType: HWConnection;
}
