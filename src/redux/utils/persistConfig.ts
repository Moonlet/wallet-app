import AsyncStorage from '@react-native-community/async-storage';
import { createMigrate } from 'redux-persist';
import { getTokenConfig } from '../tokens/static-selectors';
import { Blockchain } from '../../core/blockchain/types';

const migrations = {
    2: state => {
        // add removable to tokens from redux
        Object.keys(state.tokens).map(blockchain => {
            Object.keys(state.tokens[blockchain]).map(chainId => {
                Object.keys(state.tokens[blockchain][chainId]).map(symbolKey => {
                    const token = getTokenConfig(Blockchain[blockchain], symbolKey);
                    state.tokens[blockchain][chainId][symbolKey].removable = token
                        ? token.removable
                        : true;
                });
            });
        });
        return {
            ...state
        };
    }
};

export const persistConfig = {
    key: 'root',
    version: 2,
    storage: AsyncStorage,
    blacklist: ['ui'],
    migrate: createMigrate(migrations, { debug: false })
};
