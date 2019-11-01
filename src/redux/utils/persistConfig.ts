import AsyncStorage from '@react-native-community/async-storage';

export const persistConfig = {
    key: 'root',
    version: 1,
    storage: AsyncStorage
};
