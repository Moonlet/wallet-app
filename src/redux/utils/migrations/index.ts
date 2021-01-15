import v2 from './002';
import v3 from './003';
import v4 from './004';
import v5 from './005';
import v6 from './006';
import v7 from './007';
import v8 from './008';

export const migrations: any = {
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
    6: v6,
    /**
     * Add Cumulative Balance - 4 January 2021
     */
    7: v7,
    /**
     * Add PORT Token to all users - 14 January 2021
     */
    8: v8
};
