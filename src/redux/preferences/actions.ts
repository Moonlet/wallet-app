import { Dispatch } from 'react';
import { IReduxState } from '../state';
import { getSelectedAccount, getSelectedBlockchain } from '../wallets/selectors';
import { getBalance, setSelectedBlockchain } from '../wallets/actions';
import { Blockchain, ChainIdType } from '../../core/blockchain/types';
import { IBlockchainsOptions } from './state';
import { IAction } from '../types';
import { getBlockchains, hasNetwork } from './selectors';

// actions consts
export const PREF_SET_CURRENCY = 'PREF_SET_CURRENCY';
export const TOGGLE_TOUCH_ID = 'TOGGLE_TOUCH_ID';
export const SET_TEST_NET = 'SET_TEST_NET';
export const PREF_SET_BLOCKCHAIN_ACTIVE_STATE = 'PREF_SET_BLOCKCHAIN_ACTIVE_STATE';
export const PREF_SET_BLOCKCHAIN_ORDER = 'PREF_SET_BLOCKCHAIN_ORDER';
export const PREF_SET_NETWORK_TEST_NET_CHAIN_ID = 'PREF_SET_NETWORK_TEST_NET_CHAIN_ID';

export const setBlockchainActive = (blockchain: Blockchain, active: boolean) => (
    dispatch: Dispatch<IAction>,
    getState: () => IReduxState
) => {
    const state = getState();
    const selectedBlockchain = getSelectedBlockchain(state);

    if (selectedBlockchain === blockchain && active === false) {
        const nextBlockchain = Object.keys(state.preferences.blockchains).find(
            object => object !== blockchain
        );
        if (nextBlockchain) {
            setSelectedBlockchain(Blockchain[nextBlockchain])(dispatch, getState);
        }
    }
    dispatch({
        type: PREF_SET_BLOCKCHAIN_ACTIVE_STATE,
        data: { blockchain, active }
    });
};

export const setBlockchainOrder = (blockchains: IBlockchainsOptions[]) => {
    return {
        type: PREF_SET_BLOCKCHAIN_ORDER,
        data: { blockchains }
    };
};

export const setNetworkTestNetChainId = (blockchain: Blockchain, chainId: ChainIdType) => {
    return {
        type: PREF_SET_NETWORK_TEST_NET_CHAIN_ID,
        data: { blockchain, chainId }
    };
};

export const toggleTestNet = () => (dispatch: Dispatch<any>, getState: () => IReduxState) => {
    dispatch({
        type: SET_TEST_NET
    });
    const state = getState();

    const selectedBlockchain = getSelectedBlockchain(state);
    const networkExists = hasNetwork(Blockchain[selectedBlockchain], state.preferences.testNet);

    if (!networkExists) {
        const blockchains = getBlockchains(state);
        setSelectedBlockchain(Blockchain[blockchains[0]])(dispatch, getState);
    }

    const selectedAccount = getSelectedAccount(getState());
    getBalance(
        selectedAccount.blockchain,
        selectedAccount.address,
        undefined,
        true
    )(dispatch, getState);
};

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
