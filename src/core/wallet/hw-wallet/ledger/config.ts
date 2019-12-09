import { Blockchain } from '../../../blockchain/types';
import { HWModel, ConnectionType } from '../types';

interface ILedgerTransportConfig {
    [platform: string]: {
        // ios | android | web
        [deviceModel: string]: {
            // HWModel
            blockchains: Blockchain[];
            connectionTypes: ConnectionType;
        };
    };
}

export const ledgerConfig: ILedgerTransportConfig = {
    ios: {
        NANO_X: {
            blockchains: [Blockchain.ZILLIQA, Blockchain.ETHEREUM],
            connectionTypes: ['USB', 'BLE']
        }
    },
    android: {
        NANO_X: {
            blockchains: [Blockchain.ETHEREUM],
            connectionTypes: ['BLE']
        },
        NANO_S: {
            blockchains: [Blockchain.ETHEREUM, Blockchain.ZILLIQA],
            connectionTypes: ['USB']
        }
    },
    web: {
        NANO_X: {
            blockchains: [Blockchain.ETHEREUM],
            connectionTypes: ['USB']
        },
        NANO_S: {
            blockchains: [Blockchain.ETHEREUM, Blockchain.ZILLIQA],
            connectionTypes: ['USB']
        }
    }
};
