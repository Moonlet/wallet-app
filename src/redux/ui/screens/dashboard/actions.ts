export const ENABLE_CREATE_ACCOUNT = 'ENABLE_CREATE_ACCOUNT';
export const DISABLE_CREATE_ACCOUNT = 'DISABLE_CREATE_ACCOUNT';
export const ENABLE_RECOVER_ACCOUNT = 'ENABLE_RECOVER_ACCOUNT';
export const DISABLE_RECOVER_ACCOUNT = 'DISABLE_RECOVER_ACCOUNT';

export const enableCreateAccount = () => {
    return {
        type: ENABLE_CREATE_ACCOUNT
    };
};

export const disableCreateAccount = () => {
    return {
        type: DISABLE_CREATE_ACCOUNT
    };
};

export const enableRecoverAccount = () => {
    return {
        type: ENABLE_RECOVER_ACCOUNT
    };
};

export const disableRecoverAccount = () => {
    return {
        type: DISABLE_RECOVER_ACCOUNT
    };
};
