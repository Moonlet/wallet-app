// actions consts
export const APP_SWITCH_WALLET = 'APP_STATE_SWITCH_WALLET';
export const APP_SET_TOS_VERSION = 'APP_SET_TOS_VERSION';
export const APP_SET_TEST_NET = 'APP_SET_TEST_NET';
export const APP_SET_NETWORK_TEST_NET_CHAIN_ID = 'APP_SET_NETWORK_TEST_NET_CHAIN_ID';

// actions creators
export const appSwitchWallet = (walletId: string) => {
    return {
        type: APP_SWITCH_WALLET,
        data: walletId
    };
};

export const appSetTosVersion = (version: number) => {
    return {
        type: APP_SET_TOS_VERSION,
        data: version
    };
};

export const toggleTestNet = () => {
    return {
        type: APP_SET_TEST_NET
    };
};

export const setNetworkTestNetChainId = (blockchain: string, chainId: number) => {
    return {
        type: APP_SET_NETWORK_TEST_NET_CHAIN_ID,
        data: { blockchain, chainId }
    };
};
