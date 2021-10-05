/**
 * Add ZWBTC, ZETH, ZUSDT coins - 5 Oct 2021
 *
 */

import { addToken } from './utils';
import { Blockchain } from '../../../core/blockchain/types';
import { ZWBTC_MAINNET } from '../../../core/blockchain/zilliqa/tokens/zwbtc';
import { ZETH_MAINNET } from '../../../core/blockchain/zilliqa/tokens/zeth';
import { ZUSDT_MAINNET } from '../../../core/blockchain/zilliqa/tokens/zusdt';

export default (state: any) => {
    state = addToken(state, ZWBTC_MAINNET, {
        blockchain: Blockchain.ZILLIQA,
        chainId: '1',
        tokenActive: true
    });

    state = addToken(state, ZETH_MAINNET, {
        blockchain: Blockchain.ZILLIQA,
        chainId: '1',
        tokenActive: true
    });

    state = addToken(state, ZUSDT_MAINNET, {
        blockchain: Blockchain.ZILLIQA,
        chainId: '1',
        tokenActive: true
    });

    return {
        ...state
    };
};
