/**
 * Add Zilliqa SCO and XCAD tokens - 15 Jun 2021
 */

import { addToken } from './utils';
import { Blockchain } from '../../../core/blockchain/types';
import { SCO_MAINNET } from '../../../core/blockchain/zilliqa/tokens/sco';
import { XCAD_MAINNET } from '../../../core/blockchain/zilliqa/tokens/xcad';

export default (state: any) => {
    state = addToken(state, SCO_MAINNET, {
        blockchain: Blockchain.ZILLIQA,
        chainId: '1',
        tokenActive: false
    });

    state = addToken(state, XCAD_MAINNET, {
        blockchain: Blockchain.ZILLIQA,
        chainId: '1',
        tokenActive: false
    });

    return {
        ...state
    };
};
