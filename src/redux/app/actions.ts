// actions consts
export const SET_TC_VERSION = 'SET_TC_VERSION';
export const SET_ACCEPTED_TC_VERSION = 'SET_ACCEPTED_TC_VERSION';

// actions creators

export const appSetTcVersion = (version: number) => {
    return {
        type: SET_TC_VERSION,
        data: version
    };
};

export const appSetAcceptedTcVersion = (version: number) => {
    return {
        type: SET_ACCEPTED_TC_VERSION,
        data: version
    };
};
