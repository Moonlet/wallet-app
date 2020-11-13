/**
 * Update removable key in tokens state
 */

import { Blockchain } from '../../../core/blockchain/types';
import { getTokenConfig } from '../../tokens/static-selectors';

export default (state: any) => {
    Object.keys(state.tokens).map(blockchain => {
        Object.keys(state.tokens[blockchain]).map(chainId => {
            Object.keys(state.tokens[blockchain][chainId]).map(symbolKey => {
                const token = getTokenConfig(Blockchain[blockchain], symbolKey);
                state.tokens[blockchain][chainId][symbolKey].removable = token
                    ? token.removable
                    : true;
            });
        });
    });
    return {
        ...state
    };
};
