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

const nanosConnectionConfig = {
    connectionTypes: [HWConnection.USB]
};
const nanoXConnectionConfigBLE = {
    connectionTypes: [HWConnection.BLE]
};

export const ledgerConfig: ILedgerTransportConfig = {
    android: {
        ZILLIQA: {
            NANO_S: nanosConnectionConfig
        },
        ETHEREUM: {
            NANO_S: nanosConnectionConfig,
            NANO_X: {
                connectionTypes: [HWConnection.BLE, HWConnection.USB]
            }
        }
    },
    ios: {
        ETHEREUM: {
            NANO_X: nanoXConnectionConfigBLE
        }
    },
    web: {
        ZILLIQA: {
            NANO_S: nanosConnectionConfig
        },
        ETHEREUM: {
            NANO_S: nanosConnectionConfig,
            NANO_X: nanoXConnectionConfigBLE
        }
    }
};
