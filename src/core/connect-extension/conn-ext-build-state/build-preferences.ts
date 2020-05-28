import cloneDeep from 'lodash/cloneDeep';
import { BLOCKCHAIN_LIST } from '../../blockchain/blockchain-factory';

export const buildPreferences = (trimmedPreferences: any) => {
    let blockchains;

    if (Array.isArray(trimmedPreferences.blockchains)) {
        // Array of active Blockchains - older versions
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
        trimmedPreferences.blockchains.length > 0 &&
            BLOCKCHAIN_LIST.filter(b => !trimmedPreferences.blockchains.includes(b)).map(
                blockchain => {
                    blockchains[blockchain] = {
                        order: 999,
                        active: false
                    };
                }
            );
    } else {
        // IBlockchainsOptions type
        blockchains = cloneDeep(trimmedPreferences.blockchains);
    }

    return {
        currency: trimmedPreferences.currency,
        testNet: trimmedPreferences.testNet,
        networks: cloneDeep(trimmedPreferences.networks),
        blockchains
    };
};
