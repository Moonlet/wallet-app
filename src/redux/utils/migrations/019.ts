/**
 * Add UPDATE XCAD contract address
 */

import { Blockchain } from '../../../core/blockchain/types';
import { XCAD_MAINNET } from '../../../core/blockchain/zilliqa/tokens/xcad';

export default (state: any) => {
    if (
        state.tokens[Blockchain.ZILLIQA] &&
        state.tokens[Blockchain.ZILLIQA]['1'] &&
        state.tokens[Blockchain.ZILLIQA]['1'].XCAD
    ) {
        state.tokens[Blockchain.ZILLIQA]['1'].XCAD.contractAddress = XCAD_MAINNET.contractAddress;
    }

    return {
        ...state
    };
};
