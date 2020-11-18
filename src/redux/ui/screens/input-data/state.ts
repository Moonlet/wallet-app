export interface InputDataValidator {
    id: string;
    name: string;
    icon?: string;
    website?: string;
}

export interface IScreenInputDataValidations {
    fieldsErrors: {
        [key: string]: {
            type: 'ERROR_MSG' | 'WARN_MSG';
            message: string;
        }[];
    };
    valid: boolean;
}

export interface IScreenInputData {
    // key: 'walletPubKey-blockchain-chainId-address-tab'
    [key: string]: {
        validators: InputDataValidator[];
        validation: IScreenInputDataValidations;
    };
}

export interface IScreenInputState {
    [screen: string]: IScreenInputData;
}
