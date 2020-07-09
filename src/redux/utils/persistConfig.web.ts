import storage from 'redux-persist/lib/storage';

export const persistConfig = {
    key: 'extensionStorage',
    version: 1,
    storage,
    blacklist: ['ui']
};
