/**
 * Add SOL SPL coins - 19 Jul 2021
 *
 */

import { addToken } from './utils';
import { Blockchain } from '../../../core/blockchain/types';
import { BTC_MAINNET } from '../../../core/blockchain/solana/tokens/btc';
import { ETH_MAINNET } from '../../../core/blockchain/solana/tokens/eth';
import { JPYC_MAINNET } from '../../../core/blockchain/solana/tokens/jpyc';
import { LINK_MAINNET } from '../../../core/blockchain/solana/tokens/link';
import { RAY_MAINNET } from '../../../core/blockchain/solana/tokens/ray';
import { SUSHI_MAINNET } from '../../../core/blockchain/solana/tokens/sushi';
import { YFI_MAINNET } from '../../../core/blockchain/solana/tokens/yfi';
import { SRM_MAINNET } from '../../../core/blockchain/solana/tokens/srm';
import { FTT_MAINNET } from '../../../core/blockchain/solana/tokens/ftt';
import { UNI_MAINNET } from '../../../core/blockchain/solana/tokens/uni';
import { USDT_MAINNET } from '../../../core/blockchain/solana/tokens/usdt';
import { USDC_MAINNET } from '../../../core/blockchain/solana/tokens/usdc';

export default (state: any) => {
    // Active tokens
    const activeTokenData = {
        blockchain: Blockchain.SOLANA,
        chainId: '1',
        tokenActive: true
    };

    state = addToken(state, USDT_MAINNET, activeTokenData);
    state = addToken(state, USDC_MAINNET, activeTokenData);
    state = addToken(state, BTC_MAINNET, activeTokenData);
    state = addToken(state, ETH_MAINNET, activeTokenData);
    state = addToken(state, SRM_MAINNET, activeTokenData);
    state = addToken(state, LINK_MAINNET, activeTokenData);
    state = addToken(state, UNI_MAINNET, activeTokenData);

    // Inactive tokens
    const inactiveTokenData = {
        blockchain: Blockchain.SOLANA,
        chainId: '1',
        tokenActive: false
    };

    state = addToken(state, RAY_MAINNET, inactiveTokenData);
    state = addToken(state, SUSHI_MAINNET, inactiveTokenData);
    state = addToken(state, YFI_MAINNET, inactiveTokenData);
    state = addToken(state, JPYC_MAINNET, inactiveTokenData);
    state = addToken(state, FTT_MAINNET, inactiveTokenData);

    return {
        ...state
    };
};
