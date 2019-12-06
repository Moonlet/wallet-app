import { HWVendor, HWModel, HWConnection } from './types';
import { LedgerWallet } from './ledger/ledger-wallet';
import { TransportFactory } from './ledger/transport-factory';
import { IWallet } from '../types';

export class HWWalletFactory {
    public static async get(
        deviceVendor: HWVendor,
        deviceModel: HWModel,
        deviceId: string,
        connectionType: HWConnection
    ): Promise<IWallet> {
        switch (deviceVendor) {
            case HWVendor.LEDGER: {
                try {
                    await TransportFactory.get(deviceModel, connectionType, deviceId); // start pairing
                    return Promise.resolve(new LedgerWallet(deviceModel, connectionType, deviceId));
                } catch (e) {
                    return Promise.reject(e);
                }
            }
            default:
                return Promise.reject(deviceVendor + ' not implemented');
        }
    }
}
