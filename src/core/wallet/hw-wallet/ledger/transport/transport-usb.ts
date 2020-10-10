import TransportHID from '@ledgerhq/react-native-hid';
import { translate } from '../../../../i18n';

export class USB {
    public static async get(): Promise<Transport> {
        const isSupported = await TransportHID.isSupported();
        if (isSupported === false) {
            return Promise.reject(translate('CreateHardwareWallet.notSupported'));
        }

        return TransportHID.create();
    }

    public static async scan(callback: (event: { name: string; data?: any }) => any): Promise<any> {
        return TransportHID.listen({
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

    public static async connect(device): Promise<Transport> {
        return TransportHID.open(device);
    }
}
