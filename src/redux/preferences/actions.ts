import { Dispatch } from 'react';
import { IReduxState } from '../state';
import { getAccount, getSelectedAccount, getSelectedBlockchain } from '../wallets/selectors';
import {
    getBalance,
    setSelectedBlockchain,
    generateTokensForChainId,
    setSelectedAccount
} from '../wallets/actions';
import { Blockchain, ChainIdType } from '../../core/blockchain/types';
import { IBlockchainsOptions } from './state';
import { IAction } from '../types';
import { getBlockchains, hasNetwork, getBlockchainsPortfolio } from './selectors';
import { ExtensionEvents } from '../../core/communication/extension';
import { ExtensionEventEmitter } from '../../core/communication/extension-event-emitter';

// actions consts
export const PREF_SET_CURRENCY = 'PREF_SET_CURRENCY';
export const TOGGLE_BIOMETRIC_AUTH = 'TOGGLE_BIOMETRIC_AUTH';
export const SET_TEST_NET = 'SET_TEST_NET';
export const PREF_SET_BLOCKCHAIN_ACTIVE_STATE = 'PREF_SET_BLOCKCHAIN_ACTIVE_STATE';
export const PREF_SET_BLOCKCHAIN_ORDER = 'PREF_SET_BLOCKCHAIN_ORDER';
export const PREF_SET_NETWORK_TEST_NET_CHAIN_ID = 'PREF_SET_NETWORK_TEST_NET_CHAIN_ID';
export const PREF_SET_DEVICE_ID = 'PREF_SET_DEVICE_ID';
export const TOGGLE_CUMULATIVE_BALANCE = 'TOGGLE_CUMULATIVE_BALANCE';

export const setBlockchainActive = (blockchain: Blockchain, active: boolean) => (
    dispatch: Dispatch<IAction>,
    getState: () => IReduxState
) => {
    const state = getState();
    const selectedBlockchain = getSelectedBlockchain(state);

    if (
        (selectedBlockchain === blockchain && active === false) ||
        selectedBlockchain === undefined
    ) {
        const nextBlockchain = Object.values(getBlockchainsPortfolio(state)).find(
            object => object.key !== blockchain
        );
        if (nextBlockchain) {
            setSelectedBlockchain(Blockchain[nextBlockchain.key])(dispatch, getState);
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

export const setNetworkTestNetChainId = (blockchain: Blockchain, chainId: ChainIdType) => (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const state = getState();
    const selectedAccount = getSelectedAccount(state);

    if (selectedAccount) {
        const tokens = selectedAccount.tokens;
        if (tokens && tokens[chainId] === undefined) {
            generateTokensForChainId(blockchain, chainId)(dispatch, getState);
        }
    }

    ExtensionEventEmitter.emit(ExtensionEvents.CURRENT_NETWORK_CHANGED);
    dispatch({
        type: PREF_SET_NETWORK_TEST_NET_CHAIN_ID,
        data: { blockchain, chainId }
    });

    setSelectedAcc(blockchain)(dispatch, getState);
};

export const toggleTestNet = () => (dispatch: Dispatch<any>, getState: () => IReduxState) => {
    ExtensionEventEmitter.emit(ExtensionEvents.CURRENT_NETWORK_CHANGED);
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

    setSelectedAcc(selectedBlockchain)(dispatch, getState);
};

const setSelectedAcc = (blockchain: Blockchain) => (
    dispatch: Dispatch<any>,
    getState: () => IReduxState
) => {
    const state = getState();

    let selectedAccount = getSelectedAccount(getState());

    if (blockchain === Blockchain.NEAR) {
        // On NEAR activate the implicit account
        selectedAccount = getAccount(state, 0, blockchain);
        setSelectedAccount(selectedAccount)(dispatch, getState);
    }

    if (selectedAccount) {
        getBalance(
            selectedAccount.blockchain,
            selectedAccount.address,
            undefined,
            true
        )(dispatch, getState);
    }
};

export function toggleBiometricAuth() {
    return {
        type: TOGGLE_BIOMETRIC_AUTH
    };
}

export function setCurrency(currency: string) {
    return {
        type: PREF_SET_CURRENCY,
        data: { currency }
    };
}

export const setDeviceId = (deviceId: string) => {
    return {
        type: PREF_SET_DEVICE_ID,
        data: { deviceId }
    };
};

export function toggleCumulativeBalance() {
    return {
        type: TOGGLE_CUMULATIVE_BALANCE
    };
}
