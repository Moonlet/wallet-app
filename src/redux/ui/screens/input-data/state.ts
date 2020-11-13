export interface InputDataValidator {
    id: string;
    name: string;
    icon?: string;
    website?: string;
}

export interface IScreenInputData {
    // key: 'walletPubKey-blockchain-chainId-address-tab'
    [key: string]: {
        validators: InputDataValidator[];
    };
}

export interface IScreenInputState {
    [screen: string]: IScreenInputData;
}
