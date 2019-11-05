// actions consts
export const APP_SWITCH_WALLET = 'APP_STATE_SWITCH_WALLET';

// actions creators
export const appSwitchWallet = (walletIndex: number) => {
    return {
        type: APP_SWITCH_WALLET,
        data: walletIndex
    };
};
