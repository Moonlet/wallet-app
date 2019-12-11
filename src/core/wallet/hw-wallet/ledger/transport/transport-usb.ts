import TransportBLE from '@ledgerhq/react-native-hw-transport-ble';

export class USB {
    public static async get(): Promise<Transport> {
        // TODO
        const transport = await TransportBLE.open('');
        return Promise.resolve(transport);
    }
}
