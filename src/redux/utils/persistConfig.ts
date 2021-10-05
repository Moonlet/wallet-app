import AsyncStorage from '@react-native-community/async-storage';
import { createMigrate } from 'redux-persist';
import { migrations } from './migrations';

export const persistConfig = {
    key: 'root',
    version: 18,
    storage: AsyncStorage,
    blacklist: ['ui'],
    migrate: createMigrate(migrations, { debug: false })
};
