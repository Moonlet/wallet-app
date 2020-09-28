import { HWVendor, HWModel, HWConnection } from './types';
import { LedgerWallet } from './ledger/ledger-wallet';
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
