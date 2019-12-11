import TransportHID from '@ledgerhq/react-native-hid';

export class USB {
    public static async get(): Promise<Transport> {
        const isSupported = await TransportHID.isSupported();
        if (isSupported === false) {
            return Promise.reject('Feature not supported');
        }

        const devices = await TransportHID.list();
        if (devices.length) {
            return this.connect(devices[0]);
        }
    }

    public static async connect(device): Promise<Transport> {
        return TransportHID.open(device);
    }
}
