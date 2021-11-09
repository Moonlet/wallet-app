/**
 * Update XCAD smartcontract address change
 */

import { Blockchain } from '../../../core/blockchain/types';
import { XCAD_MAINNET } from '../../../core/blockchain/zilliqa/tokens/xcad';

export default (state: any) => {
    const zilChainIdMain = '1';

    if (
        state.tokens[Blockchain.ZILLIQA] &&
        state.tokens[Blockchain.ZILLIQA][zilChainIdMain] &&
        state.tokens[Blockchain.ZILLIQA][zilChainIdMain][XCAD_MAINNET.symbol]
    ) {
        // Update XCAD contract address
        state.tokens[Blockchain.ZILLIQA][zilChainIdMain][XCAD_MAINNET.symbol].contractAddress =
            XCAD_MAINNET.contractAddress;

        // Update XCAD decimals
        state.tokens[Blockchain.ZILLIQA][zilChainIdMain][XCAD_MAINNET.symbol].decimals =
            XCAD_MAINNET.decimals;
    }

    return {
        ...state
    };
};
