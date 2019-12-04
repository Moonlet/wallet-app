import { WalletType, IWallet } from './types';
import { HDWallet } from './hd-wallet/hd-wallet';
import { HWVendor, HWModel, HWConnection } from './hw-wallet/types';
import { HWWalletFactory } from './hw-wallet/hw-wallet-factory';
import { Blockchain } from '../blockchain/types';

export class WalletFactory {
    public static async get(
        walletId: string,
        walletType: WalletType,
        options: {
            pass?: string;
            deviceVendor?: HWVendor;
            deviceModel?: HWModel;
            deviceId?: string;
            connectionType?: HWConnection;
            blockchain?: Blockchain;
        }
    ): Promise<IWallet> {
        switch (walletType) {
            case WalletType.HD:
                return HDWallet.loadFromStorage(walletId, options.pass);
            case WalletType.HW:
                return HWWalletFactory.get(
                    options.deviceVendor,
                    options.deviceModel,
                    options.deviceId,
                    options.connectionType
                );
            default:
                return HDWallet.loadFromStorage(walletId, options.pass);
        }
    }
}
