/**
 * Add ZWAP Token to all users - 2 Feb 2021
 */

import { addToken } from './utils';
import { Blockchain } from '../../../core/blockchain/types';
import { GRT_MAINNET, GRT_TESTNET } from '../../../core/blockchain/ethereum/tokens/grt';

export default (state: any) => {
    state = addToken(state, GRT_TESTNET, {
        blockchain: Blockchain.ETHEREUM,
        chainId: '4',
        tokenActive: true
    });

    state = addToken(state, GRT_MAINNET, {
        blockchain: Blockchain.ETHEREUM,
        chainId: '1',
        tokenActive: true
    });

    return {
        ...state
    };
};
