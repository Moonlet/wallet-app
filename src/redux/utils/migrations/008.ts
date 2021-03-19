/**
 * Add PORT Token to all users - 12 September 2020
 */

import { addToken } from './utils';
import { Blockchain } from '../../../core/blockchain/types';
import { PORT_MAINNET } from '../../../core/blockchain/zilliqa/tokens/port';

export default (state: any) => {
    state = addToken(state, PORT_MAINNET, {
        blockchain: Blockchain.ZILLIQA,
        chainId: '1',
        tokenActive: true
    });

    return {
        ...state
    };
};
