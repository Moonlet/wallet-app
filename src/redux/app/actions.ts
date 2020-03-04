// actions consts
export const SET_ACCEPTED_TC_VERSION = 'SET_ACCEPTED_TC_VERSION';

// actions creators

export const appSetAcceptedTcVersion = (version: number) => {
    return {
        type: SET_ACCEPTED_TC_VERSION,
        data: version
    };
};
