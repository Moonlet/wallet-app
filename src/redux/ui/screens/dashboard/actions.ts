// actions consts
export const ENABLE_CREATE_ACCOUNT = 'ENABLE_CREATE_ACCOUNT';
export const DISABLE_CREATE_ACCOUNT = 'DISABLE_CREATE_ACCOUNT';

// actions creators
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
