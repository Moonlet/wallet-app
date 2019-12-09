import { HWModel, HWConnection } from '../types';
import { BLE } from './transport/transport-ble';
import { USB } from './transport/transport-usb';
import { Platform } from 'react-native';

export class TransportFactory {
    public static async get(
        deviceModel: HWModel,
        connectionType: HWConnection,
        deviceId?: string
    ): Promise<Transport> {
        switch (deviceModel) {
            case HWModel.NANO_S:
                return USB.get();

            case HWModel.NANO_X: {
                if (connectionType === HWConnection.BLE) {
                    return BLE.get(deviceId);
                } else {
                    switch (Platform.OS) {
                        case 'android':
                            return USB.get();
                        case 'web':
                            return USB.get();
                        default:
                            return Promise.reject();
                    }
                }
            }
            default:
                return Promise.reject();
        }
    }
}
