import AsyncStorage from '@react-native-community/async-storage';

export const persistConfig = {
    key: 'root',
    version: 1,
    storage: AsyncStorage
    // whitelist: ['preferences'] // only user and activity information will be persisted
};
