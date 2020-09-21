import { Blockchain } from '../../../core/blockchain/types';
import { HWConnection, HWModel } from '../../../core/wallet/hw-wallet/types';

export const DISPLAY_LEDGER_CONNECT = 'DISPLAY_LEDGER_CONNECT';

export const setDisplayLedgerConnect = (
    visible: boolean,
    blockchain: Blockchain,
    deviceModel: HWModel,
    connectionType: HWConnection
) => {
    return {
        type: DISPLAY_LEDGER_CONNECT,
        data: { visible, blockchain, deviceModel, connectionType }
    };
};
