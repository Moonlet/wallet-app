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

interface ILedgerConfig {
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

export const ledgerConfigNew: ILedgerConfig = {
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

export const ledgerConfig: ILedgerTransportConfig = {
    android: {
        NANO_S: {
            blockchains: [Blockchain.ETHEREUM, Blockchain.ZILLIQA],
            connectionTypes: [HWConnection.USB]
        },
        NANO_X: {
            blockchains: [Blockchain.ETHEREUM],
            connectionTypes: [HWConnection.USB, HWConnection.BLE]
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
