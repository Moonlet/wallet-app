import TransportBLE from '@ledgerhq/react-native-hw-transport-ble';
import { Platform, PermissionsAndroid } from 'react-native';

export class BLE {
    public static async get(deviceId): Promise<Transport> {
        return new Promise(async (resolve, reject) => {
            if (Platform.OS === 'android') {
                await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
                );
            }
            TransportBLE.listen({
                next: async e => {
                    if (e.type === 'add') {
                        const device = e.descriptor;
                        const transport = await TransportBLE.open(device);
                        resolve(transport);
                    }
                },
                error: error => {
                    reject(error);
                }
            });
        });
    }
}
