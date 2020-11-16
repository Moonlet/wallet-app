import { Blockchain } from '../../../src/core/blockchain/types';
import { ZilliqaProvider } from './zilliqa-provider';
import { BaseProvider } from './base-provider';

export const getPorvider = (blockchain: Blockchain): BaseProvider => {
    switch (blockchain) {
        case Blockchain.ZILLIQA:
            return new ZilliqaProvider();
        default:
            throw new Error(`${blockchain} has no providers available.`);
    }
};
