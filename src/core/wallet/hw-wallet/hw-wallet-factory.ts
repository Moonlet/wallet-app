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
                    // call for transport must be done here to display native popup to start pairing the bluetooth device

                    await TransportFactory.get(deviceModel, connectionType, deviceId);
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
