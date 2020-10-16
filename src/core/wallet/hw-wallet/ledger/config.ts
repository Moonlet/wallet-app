import { HWConnection } from '../types';
import { isFeatureActive, RemoteFeature } from '../../../utils/remote-feature-config';

export interface ILedgerTransportConfig {
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
const nanoXConnectionConfigUSB = {
    connectionTypes: [HWConnection.USB]
};

export const ledgerConfigInternal: ILedgerTransportConfig = {
    android: {
        ZILLIQA: {
            NANO_S: nanosConnectionConfig,
            NANO_X: {
                connectionTypes: [HWConnection.BLE, HWConnection.USB]
            }
        },
        NEAR: {
            NANO_S: nanosConnectionConfig,
            NANO_X: {
                connectionTypes: [HWConnection.BLE, HWConnection.USB]
            }
        },
        ETHEREUM: {
            NANO_S: nanosConnectionConfig,
            NANO_X: {
                connectionTypes: [HWConnection.BLE, HWConnection.USB]
            }
        },
        COSMOS: {
            NANO_S: nanosConnectionConfig,
            NANO_X: nanoXConnectionConfigUSB
        },
        CELO: {
            NANO_S: nanosConnectionConfig,
            NANO_X: {
                connectionTypes: [HWConnection.BLE, HWConnection.USB]
            }
        }
    },
    ios: {
        ZILLIQA: {
            NANO_X: nanoXConnectionConfigBLE
        },
        NEAR: {
            NANO_X: nanoXConnectionConfigBLE
        },
        ETHEREUM: {
            NANO_X: nanoXConnectionConfigBLE
        },
        CELO: {
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
        },
        COSMOS: {
            NANO_S: nanosConnectionConfig,
            NANO_X: nanoXConnectionConfigUSB
        }
    }
};

export const ledgerSetupConfig = async (): Promise<ILedgerTransportConfig> => {
    return new Promise(async (resolve, reject) => {
        if (!isFeatureActive(RemoteFeature.COSMOS)) {
            delete ledgerConfigInternal.android.COSMOS;
            delete ledgerConfigInternal.ios.COSMOS;
            delete ledgerConfigInternal.web.COSMOS;
        }

        if (!isFeatureActive(RemoteFeature.NEAR)) {
            delete ledgerConfigInternal.android.NEAR;
            delete ledgerConfigInternal.ios.NEAR;
        }

        if (!isFeatureActive(RemoteFeature.CELO)) {
            delete ledgerConfigInternal.android.CELO;
            delete ledgerConfigInternal.ios.CELO;
        }

        return resolve(ledgerConfigInternal);
    });
};
