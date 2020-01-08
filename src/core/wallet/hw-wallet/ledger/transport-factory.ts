import { HWModel, HWConnection } from '../types';
import { BLE } from './transport/transport-ble';
import { USB } from './transport/transport-usb';

export class TransportFactory {
    public static async get(
        deviceModel: HWModel,
        connectionType: HWConnection,
        deviceId?: string
    ): Promise<Transport> {
        if (connectionType === HWConnection.BLE) {
            return BLE.get(deviceId);
        } else {
            return USB.get();
        }
    }
    public static async scan(
        connectionType: HWConnection,
        callback: (event: { name: string; data?: any }) => any
    ): Promise<any> {
        if (connectionType === HWConnection.BLE) {
            return BLE.scan(callback);
        } else {
            return USB.scan(callback);
        }
    }
    public static async connect(connectionType: HWConnection, device): Promise<Transport> {
        if (connectionType === HWConnection.BLE) {
            return BLE.connect(device.id);
        } else {
            return USB.connect(device);
        }
    }
}
