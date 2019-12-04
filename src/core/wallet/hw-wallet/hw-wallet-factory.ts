import { IWallet } from '../types';
import { HWVendor, HWModel, HWConnection } from './types';
import { LedgerWallet } from './ledger/ledger-wallet';
import { TransportFactory } from './ledger/transport-factory';

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
                    const transport = await TransportFactory.get(
                        deviceModel,
                        connectionType,
                        deviceId
                    );
                    return Promise.resolve(new LedgerWallet(transport));
                } catch (e) {
                    return Promise.reject(e);
                }
            }
            default:
                return Promise.reject(deviceVendor + ' not implemented');
        }
    }
}
