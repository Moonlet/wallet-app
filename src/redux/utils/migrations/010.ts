/**
 * Add ZRC-2 Tokens to all users - 19 Mar 2021
 */

import { addToken } from './utils';

import { ZLP_MAINNET } from '../../../core/blockchain/zilliqa/tokens/zlp';
import { BARTER_MAINNET } from '../../../core/blockchain/zilliqa/tokens/barter';
import { BOLT_MAINNET } from '../../../core/blockchain/zilliqa/tokens/bolt';
import { REDC_MAINNET } from '../../../core/blockchain/zilliqa/tokens/redc';
import { SERGS_MAINNET } from '../../../core/blockchain/zilliqa/tokens/sergs';
import { SHRK_MAINNET } from '../../../core/blockchain/zilliqa/tokens/shrk';
import { KKZ_MAINNET } from '../../../core/blockchain/zilliqa/tokens/kkz';
import { ZCH_MAINNET } from '../../../core/blockchain/zilliqa/tokens/zch';
import { ZLF_MAINNET } from '../../../core/blockchain/zilliqa/tokens/zlf';
import { ZYF_MAINNET } from '../../../core/blockchain/zilliqa/tokens/zyf';
import { ZYRO_MAINNET } from '../../../core/blockchain/zilliqa/tokens/zyro';
import { CARB_MAINNET } from '../../../core/blockchain/zilliqa/tokens/carb';
import { Blockchain } from '../../../core/blockchain/types';

export default (state: any) => {
    const data = {
        blockchain: Blockchain.ZILLIQA,
        chainId: '1',
        tokenActive: false
    };

    state = addToken(state, ZLP_MAINNET, data);
    state = addToken(state, BARTER_MAINNET, data);
    state = addToken(state, BOLT_MAINNET, data);
    state = addToken(state, REDC_MAINNET, data);
    state = addToken(state, SERGS_MAINNET, data);
    state = addToken(state, SHRK_MAINNET, data);
    state = addToken(state, KKZ_MAINNET, data);
    state = addToken(state, ZCH_MAINNET, data);
    state = addToken(state, ZLF_MAINNET, data);
    state = addToken(state, ZYF_MAINNET, data);
    state = addToken(state, ZYRO_MAINNET, data);
    state = addToken(state, CARB_MAINNET, data);

    return {
        ...state
    };
};
