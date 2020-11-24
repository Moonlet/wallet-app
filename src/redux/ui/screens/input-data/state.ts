export interface IScreenInputState {
    // 'walletPubKey-blockchain-chainId-address-step-tab'
    [screenKey: string]: IScreenInputData;
}

export interface IScreenInputData {
    validation: IScreenInputDataValidations;

    // Save here any input data
    data: {
        [key: string]: any;
    };
}

export interface IScreenInputDataValidations {
    fieldsErrors: {
        [fieldName: string]: {
            type: 'ERROR_MSG' | 'WARN_MSG';
            message: string;
        }[];
    };
    valid: boolean;
}

export interface InputDataValidator {
    id: string;
    name: string;
    icon?: string;
    website?: string;
}
