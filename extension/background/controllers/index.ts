import { ProvidersController } from './providers-controller';
import { AccountAccessController } from './account-access-controller';
import { ScreenController } from './screen-controller';

const instances: { [key: string]: any } = {};

export const Controllers = {
    init() {
        instances.AccountAccessController = new AccountAccessController();
        instances.ProvidersController = new ProvidersController();
        instances.ScreenController = new ScreenController();
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
