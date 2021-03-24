/**
 * Add gZil Token to all users - 12 September 2020
 */

import { addToken } from './utils';
import { Blockchain } from '../../../core/blockchain/types';
import { GZIL_MAINNET } from '../../../core/blockchain/zilliqa/tokens/gzil';

export default (state: any) => {
    state = addToken(state, GZIL_MAINNET, {
        blockchain: Blockchain.ZILLIQA,
        chainId: '1',
        tokenActive: true
    });

    return {
        ...state
    };
};
