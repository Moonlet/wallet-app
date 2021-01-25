import TransportBLE from '@ledgerhq/react-native-hw-transport-ble';
import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

let transportOpenInProgress = false;
let transportPromise;

export class BLE {
    public static async get(deviceId): Promise<Transport> {
        return this.connect(deviceId);
    }

    public static async connect(deviceId): Promise<Transport> {
        // console.log('device id connect ble', deviceId, transportOpenInProgress);
        if (transportOpenInProgress && transportPromise) {
            return transportPromise;
        }
        try {
            transportOpenInProgress = true;
            transportPromise = TransportBLE.open(deviceId);
            transportOpenInProgress = false;
        } catch (e) {
            // console.log('error connect', e);
            transportOpenInProgress = false;
            return Promise.reject(e);
        }

        return transportPromise;
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
                callback({ name: 'scanError', data: error });
            }
        });
    }

    public static async requestPermissions(): Promise<boolean> {
        if (Platform.OS === 'android') {
            const granted = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
            );

            return new Promise(resolve => {
                Geolocation.getCurrentPosition(
                    async info => {
                        if (info) {
                            if (granted) resolve(true);
                            else {
                                const requested = await PermissionsAndroid.request(
                                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                                );
                                resolve(requested === PermissionsAndroid.RESULTS.GRANTED);
                            }
                        } else resolve(false);
                    },
                    error => {
                        resolve(false);
                    },
                    { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
                );
            });
        }
        return true;
    }
}
