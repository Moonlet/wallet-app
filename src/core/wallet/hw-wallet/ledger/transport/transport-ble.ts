import TransportBLE from '@ledgerhq/react-native-hw-transport-ble';
import { Platform, PermissionsAndroid } from 'react-native';

export class BLE {
    public static async get(deviceId): Promise<Transport> {
        return this.connect(deviceId);
    }

    public static async connect(deviceId): Promise<Transport> {
        return TransportBLE.open(deviceId);
    }

    public static async scan(callback: (event: { name: string; data?: any }) => any): Promise<any> {
        await BLE.requestPermissions();

        return TransportBLE.listen({
            complete: e => {
                callback({ name: 'scanEnded' });
            },
            next: async e => {
                if (e.type === 'add') {
                    callback({ name: 'deviceFound', data: e.descriptor });
                }
            },
            error: error => {
                // todo handle possible errors
            }
        });
    }

    private static async requestPermissions(): Promise<boolean> {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
            );
            if (granted) {
                return true;
            } else {
                const requested = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
                );
                return requested === PermissionsAndroid.RESULTS.GRANTED;
            }
        }
        return true;
    }
}
