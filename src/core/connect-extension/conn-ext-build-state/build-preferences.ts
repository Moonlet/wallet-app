import * as IExtStorage from '../types';
import { cloneDeep } from 'lodash';
import { BLOCKCHAIN_LIST } from '../../blockchain/blockchain-factory';

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

    // add inactive blockchains
    BLOCKCHAIN_LIST.filter(b => !trimmedPreferences.blockchains.includes(b)).map(blockchain => {
        blockchains[blockchain] = {
            order: 999,
            active: false
        };
    });

    return {
        currency: trimmedPreferences.currency,
        testNet: trimmedPreferences.testNet,
        networks: cloneDeep(trimmedPreferences.networks),
        blockchains
    };
};
