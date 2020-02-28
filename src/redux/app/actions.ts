// actions consts
export const APP_SET_TC_VERSION = 'APP_SET_TC_VERSION';

// actions creators

export const appSetTcVersion = (version: number) => {
    return {
        type: APP_SET_TC_VERSION,
        data: version
    };
};
