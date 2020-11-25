import v2 from './002';
import v3 from './003';
import v4 from './004';
import v5 from './005';
import v6 from './006';

export const migrations = {
    /**
     * Update removable key in tokens state
     */
    2: v2,
    /**
     * Add XSGD and DAI Tokens for all users by default
     */
    3: v3,
    /**
     * Update XSGD smartcontract address change
     */
    4: v4,
    /**
     * Add Account Default Type
     */
    5: v5,
    /**
     * Add gZil Token to all users - 12 September 2020
     */
    6: v6
};
