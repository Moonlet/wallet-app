import { HWConnection } from '../types';

interface ILedgerTransportConfig {
    // ios | android | web
    [platform: string]: {
        // Blockchain
        [blockchains: string]: {
            // Model
            [deviceModel: string]: {
                connectionTypes: HWConnection[];
            };
        };
    };
}

export const ledgerConfig: ILedgerTransportConfig = {
    android: {
        ZILLIQA: {
            NANO_S: {
                connectionTypes: [HWConnection.USB]
            }
        },
        ETHEREUM: {
            NANO_S: {
                connectionTypes: [HWConnection.USB]
            },
            NANO_X: {
                connectionTypes: [HWConnection.BLE, HWConnection.USB]
            }
        }
    },
    ios: {
        ETHEREUM: {
            NANO_X: {
                connectionTypes: [HWConnection.BLE]
            }
        }
    },
    web: {
        ZILLIQA: {
            NANO_S: {
                connectionTypes: [HWConnection.USB]
            }
        },
        ETHEREUM: {
            NANO_S: {
                connectionTypes: [HWConnection.USB]
            },
            NANO_X: {
                connectionTypes: [HWConnection.BLE]
            }
        }
    }
};
