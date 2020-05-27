import * as IExtStorage from '../types';
import cloneDeep from 'lodash/cloneDeep';

export const buildPreferences = (trimmedPreferences: IExtStorage.IStoragePreferences) => {
    return {
        currency: trimmedPreferences.currency,
        testNet: trimmedPreferences.testNet,
        networks: cloneDeep(trimmedPreferences.networks),
        blockchains: cloneDeep(trimmedPreferences.blockchains)
    };
};
