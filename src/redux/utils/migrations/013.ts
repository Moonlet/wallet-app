/**
 * Add UPDATE Token to all users
 */

import { Blockchain } from '../../../core/blockchain/types';
import { TokenScreenComponentType } from '../../../core/blockchain/types/token';

export default (state: any) => {
    if (
        state.tokens[Blockchain.ETHEREUM] &&
        state.tokens[Blockchain.ETHEREUM]['4'] &&
        state.tokens[Blockchain.ETHEREUM]['4'].GRT
    ) {
        // Update token screen type
        state.tokens[Blockchain.ETHEREUM]['4'].GRT.ui = {
            ...state.tokens[Blockchain.ETHEREUM]['4'].GRT.ui,
            tokenScreenComponent: TokenScreenComponentType.DEFAULT
        };
        state.tokens[Blockchain.ETHEREUM]['4'].GRT.removable = true;
    }

    if (
        state.tokens[Blockchain.ETHEREUM] &&
        state.tokens[Blockchain.ETHEREUM]['1'] &&
        state.tokens[Blockchain.ETHEREUM]['1'].GRT
    ) {
        // Update token screen type
        state.tokens[Blockchain.ETHEREUM]['1'].GRT.ui = {
            ...state.tokens[Blockchain.ETHEREUM]['1'].GRT.ui,
            tokenScreenComponent: TokenScreenComponentType.DEFAULT
        };
        state.tokens[Blockchain.ETHEREUM]['1'].GRT.removable = true;
    }

    return {
        ...state
    };
};
