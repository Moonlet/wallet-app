import { Dispatch } from 'react';
import { IReduxState } from '../state';
import { getCurrentAccount } from '../wallets/selectors';
import { getBalance } from '../wallets/actions';
import { Blockchain } from '../../core/blockchain/types';
import { IBlockchainsOptions } from './state';

// actions consts
export const PREF_SET_CURRENCY = 'PREF_SET_CURRENCY';
export const TOGGLE_PIN_LOGIN = 'TOGGLE_PIN_LOGIN';
export const TOGGLE_TOUCH_ID = 'TOGGLE_TOUCH_ID';
export const SET_TEST_NET = 'SET_TEST_NET';
export const PREF_SET_BLOCKCHAIN_ACTIVE_STATE = 'PREF_SET_BLOCKCHAIN_ACTIVE_STATE';
export const PREF_SET_BLOCKCHAIN_ORDER = 'PREF_SET_BLOCKCHAIN_ORDER';
export const PREF_SET_NETWORK_TEST_NET_CHAIN_ID = 'PREF_SET_NETWORK_TEST_NET_CHAIN_ID';

// actions creators

export const setBlockchainActive = (blockchain: Blockchain) => {
    return {
        type: PREF_SET_BLOCKCHAIN_ACTIVE_STATE,
        data: { blockchain }
    };
};

export const setBlockchainOrder = (blockchains: IBlockchainsOptions[]) => {
    return {
        type: PREF_SET_BLOCKCHAIN_ORDER,
        data: { blockchains }
    };
};

export const setNetworkTestNetChainId = (blockchain: Blockchain, chainId: number) => {
    return {
        type: PREF_SET_NETWORK_TEST_NET_CHAIN_ID,
        data: { blockchain, chainId }
    };
};

export const toggleTestNet = () => (dispatch: Dispatch<any>, getState: () => IReduxState) => {
    const state = getState();
    const currentAccount = getCurrentAccount(state);

    dispatch({
        type: SET_TEST_NET
    });
    getBalance(
        currentAccount.blockchain,
        currentAccount.address,
        undefined,
        true
    )(dispatch, getState);
};

export function togglePinLogin() {
    return {
        type: TOGGLE_PIN_LOGIN
    };
}

export function toggleTouchID() {
    return {
        type: TOGGLE_TOUCH_ID
    };
}

export function setCurrency(currency: string) {
    return {
        type: PREF_SET_CURRENCY,
        data: { currency }
    };
}
