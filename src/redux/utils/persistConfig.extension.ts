import { localStorage } from 'redux-persist-webextension-storage';
import { createMigrate } from 'redux-persist';
import { migrations } from './migrations';

export const persistConfig = {
    key: 'extensionStorage',
    version: 1,
    storage: localStorage,
    blacklist: ['ui'],
    migrate: createMigrate(migrations, { debug: false })
};
