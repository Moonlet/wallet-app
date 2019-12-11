import { HWModel, HWConnection } from '../types';
import { BLE } from './transport/transport-ble';
import { USB } from './transport/transport-usb';
import { Platform } from 'react-native';
import { ledgerConfig } from './config';

export class TransportFactory {
    public static async get(
        deviceModel: HWModel,
        connectionType: HWConnection,
        deviceId?: string
    ): Promise<Transport> {
        if (ledgerConfig[Platform.OS][deviceModel].connectionTypes.includes(connectionType)) {
            if (connectionType === HWConnection.BLE) {
                return BLE.get(deviceId);
            } else {
                return USB.get();
            }
        }
    }
}
