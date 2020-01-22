import { Blockchain } from '../../core/blockchain/types';

// actions consts
export const APP_SWITCH_WALLET = 'APP_STATE_SWITCH_WALLET';
export const APP_SET_TOS_VERSION = 'APP_SET_TOS_VERSION';
export const APP_SET_SELECTED_BLOCKCHAIN = 'APP_SET_SELECTED_BLOCKCHAIN';

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

export const setSelectedBlockchain = (blockchain: Blockchain) => {
    return {
        type: APP_SET_SELECTED_BLOCKCHAIN,
        data: blockchain
    };
};
