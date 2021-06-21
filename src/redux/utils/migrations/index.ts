import v2 from './002';
import v3 from './003';
import v4 from './004';
import v5 from './005';
import v6 from './006';
import v7 from './007';
import v8 from './008';
import v9 from './009';
import v10 from './010';
import v11 from './011';
import v12 from './012';
import v13 from './013';
import v14 from './014';
import v15 from './015';

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
    8: v8,
    /**
     * Add ZWAP Token to all users - 2 Feb 2021
     */
    9: v9,
    /**
     * Add ZRC-2 Tokens to all users - 19 Mar 2021
     */
    10: v10,
    /**
     * Solana change `Account 0` to `Root Account` - 25 Mar 2021
     */
    11: v11,
    /**
     * Add GRT testnet to rinkeby and GRT Mainnet - 25 Apr 2021
     */
    12: v12,
    /**
     * Update GRT testnet to rinkeby and GRT Mainnet - 25 Apr 2021
     */
    13: v13,
    /**
     * Add Zilliqa SCO and XCAD tokens - 15 Jun 2021
     */
    14: v14,
    /**
     * Update validators redux - 21 Jun 2021
     */
    15: v15
};
