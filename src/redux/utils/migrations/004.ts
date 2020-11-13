/**
 * Update XSGD smartcontract address change
 */

import { Blockchain } from '../../../core/blockchain/types';
import { XSGD_MAINNET } from '../../../core/blockchain/zilliqa/tokens/xsgd';

export default (state: any) => {
    const zilChainIdMain = '1';

    if (
        state.tokens[Blockchain.ZILLIQA] &&
        state.tokens[Blockchain.ZILLIQA][zilChainIdMain] &&
        state.tokens[Blockchain.ZILLIQA][zilChainIdMain][XSGD_MAINNET.symbol]
    ) {
        // Update XSGD contract address
        state.tokens[Blockchain.ZILLIQA][zilChainIdMain][XSGD_MAINNET.symbol].contractAddress =
            XSGD_MAINNET.contractAddress;
    }

    return {
        ...state
    };
};
