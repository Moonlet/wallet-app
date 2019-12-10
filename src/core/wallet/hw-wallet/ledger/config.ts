import { Blockchain } from '../../../blockchain/types';
import { HWModel, ConnectionType, HWConnection } from '../types';

interface ILedgerTransportConfig {
    [platform: string]: {
        // ios | android | web
        [deviceModel: string]: {
            // HWModel
            blockchains: Blockchain[];
            connectionTypes: HWConnection[];
        };
    };
}

export const ledgerConfig: ILedgerTransportConfig = {
    ios: {
        NANO_X: {
            blockchains: [Blockchain.ZILLIQA, Blockchain.ETHEREUM],
            connectionTypes: [HWConnection.USB, HWConnection.BLE]
        }
    },
    android: {
        NANO_X: {
            blockchains: [Blockchain.ETHEREUM],
            connectionTypes: [HWConnection.BLE]
        },
        NANO_S: {
            blockchains: [Blockchain.ETHEREUM, Blockchain.ZILLIQA],
            connectionTypes: [HWConnection.BLE]
        }
    },
    web: {
        NANO_X: {
            blockchains: [Blockchain.ETHEREUM],
            connectionTypes: [HWConnection.BLE]
        },
        NANO_S: {
            blockchains: [Blockchain.ETHEREUM, Blockchain.ZILLIQA],
            connectionTypes: [HWConnection.BLE]
        }
    }
};
