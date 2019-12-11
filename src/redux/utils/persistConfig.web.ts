import { localStorage } from 'redux-persist-webextension-storage';

export const persistConfig = {
    key: 'extensionStorage',
    storage: localStorage,
    blacklist: ['screens']
};
