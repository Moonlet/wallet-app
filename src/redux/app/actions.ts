// actions consts
export const APP_SET_TOS_VERSION = 'APP_SET_TOS_VERSION';

// actions creators

export const appSetTosVersion = (version: number) => {
    return {
        type: APP_SET_TOS_VERSION,
        data: version
    };
};
