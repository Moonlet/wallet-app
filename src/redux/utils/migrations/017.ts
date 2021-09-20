/**
 * Add ZIL XCAD coin - 14 Sept 2021
 *
 */

import { addToken } from './utils';
import { Blockchain } from '../../../core/blockchain/types';
import { GZIL_MAINNET } from '../../../core/blockchain/zilliqa/tokens/gzil';
import { XCAD_MAINNET } from '../../../core/blockchain/zilliqa/tokens/xcad';

export default (state: any) => {
    // XCAD - 3rd position
    state = addToken(state, XCAD_MAINNET, {
        blockchain: Blockchain.ZILLIQA,
        chainId: '1',
        tokenActive: true,
        order: XCAD_MAINNET.defaultOrder // 910
    });

    // make sure GZIL is above XCAD
    // GZIL - 2nd position
    state = addToken(state, GZIL_MAINNET, {
        blockchain: Blockchain.ZILLIQA,
        chainId: '1',
        tokenActive: true,
        changeOrder: GZIL_MAINNET.defaultOrder //  900
    });

    return {
        ...state
    };
};
