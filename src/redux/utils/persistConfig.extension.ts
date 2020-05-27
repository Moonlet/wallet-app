import { localStorage } from 'redux-persist-webextension-storage';

export const persistConfig = {
    key: 'extensionStorage',
    version: 1,
    storage: localStorage,
    blacklist: ['ui']
};
