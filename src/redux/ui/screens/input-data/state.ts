export interface InputDataValidator {
    id: string;
    name: string;
    icon?: string;
    website?: string;
}

export interface IScreenInputDataValidations {
    fieldsErrors: {
        type: 'ERROR_MSG' | 'WARN_MSG';
        message: string;
    }[];
    valid: boolean;
}

export interface IScreenInputData {
    validators: InputDataValidator[];
    validation: IScreenInputDataValidations;
    inputAmount: string;
    screenAmount: string;
    switchNodeValidator: any;
}

export interface IScreenInputState {
    // 'walletPubKey-blockchain-chainId-address-step-tab'
    [screenKey: string]: IScreenInputData;
}
