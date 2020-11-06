export interface IScreenInputData {
    // key: 'walletPubKey-blockchain-chainId-address-tab'
    [key: string]: {
        validators: string[];
    };
}

export interface IScreenInputState {
    [screen: string]: IScreenInputData;
}
