import { WalletType, IWallet } from './types';
import { HDWallet } from './hd-wallet/hd-wallet';

export class WalletFactory {
    public static async get(walletId: string, walletType: WalletType): Promise<IWallet> {
        switch (walletType) {
            case WalletType.HD:
            default:
                return HDWallet.loadFromStorage(walletId);
        }
    }
}
