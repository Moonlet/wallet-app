/**
 * Add ZWAP Token to all users - 2 Feb 2021
 */

import { addToken } from './utils';
import { Blockchain } from '../../../core/blockchain/types';
import { ZWAP_MAINNET } from '../../../core/blockchain/zilliqa/tokens/zwap';

export default (state: any) => {
    state = addToken(state, ZWAP_MAINNET, {
        blockchain: Blockchain.ZILLIQA,
        chainId: '1',
        tokenActive: true
    });

    return {
        ...state
    };
};
