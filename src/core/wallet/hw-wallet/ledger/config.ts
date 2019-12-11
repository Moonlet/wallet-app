import { Blockchain } from '../../../blockchain/types';
import { HWConnection } from '../types';

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
    android: {
        NANO_S: {
            blockchains: [Blockchain.ETHEREUM, Blockchain.ZILLIQA],
            connectionTypes: [HWConnection.USB]
        },
        NANO_X: {
            blockchains: [Blockchain.ETHEREUM],
            connectionTypes: [HWConnection.BLE]
        }
    },
    ios: {
        NANO_X: {
            blockchains: [Blockchain.ETHEREUM],
            connectionTypes: [HWConnection.BLE]
        }
    },
    web: {
        NANO_X: {
            blockchains: [Blockchain.ETHEREUM],
            connectionTypes: [HWConnection.USB]
        },
        NANO_S: {
            blockchains: [Blockchain.ETHEREUM, Blockchain.ZILLIQA],
            connectionTypes: [HWConnection.USB]
        }
    }
};
