/**
 * Add XSGD and DAI Tokens for all users by default
 */

import { addToken } from './utils';
import { Blockchain } from '../../../core/blockchain/types';
import { XSGD_MAINNET } from '../../../core/blockchain/zilliqa/tokens/xsgd';
import { DAI_MAINNET } from '../../../core/blockchain/ethereum/tokens/dai';

export default (state: any) => {
    state = addToken(state, XSGD_MAINNET, {
        blockchain: Blockchain.ZILLIQA,
        chainId: '1',
        tokenActive: true
    });

    state = addToken(state, DAI_MAINNET, {
        blockchain: Blockchain.ETHEREUM,
        chainId: '1',
        tokenActive: true
    });

    return {
        ...state
    };
};
