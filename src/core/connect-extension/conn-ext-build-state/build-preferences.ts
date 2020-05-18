import * as IExtStorage from '../types';
import { cloneDeep } from 'lodash';

export const buildPreferences = (trimmedPreferences: IExtStorage.IStoragePreferences) => {
    const blockchains = {};

    trimmedPreferences.blockchains.map((blockchain: string, index: number) => {
        Object.assign(blockchains, {
            ...blockchains,
            [blockchain]: {
                order: index,
                active: true
            }
        });
    });

    return {
        currency: trimmedPreferences.currency,
        testNet: trimmedPreferences.testNet,
        networks: cloneDeep(trimmedPreferences.networks),
        blockchains
    };
};
