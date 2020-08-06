import { ProvidersController } from './providers-controller';
import { AccountAccessController } from './account-access-controller';
import { ScreenController } from './screen-controller';
import { WalletSyncController } from './wallet-sync-controller';

const instances: { [key: string]: any } = {};

export const Controllers = {
    init() {
        instances.AccountAccessController = new AccountAccessController();
        instances.ProvidersController = new ProvidersController();
        instances.ScreenController = new ScreenController();
        instances.WalletSyncController = new WalletSyncController();
    },
    get() {
        return instances;
    },
    getAccountAccess() {
        return instances.AccountAccessController;
    },
    getProviders() {
        return instances.ProvidersController;
    }
};
