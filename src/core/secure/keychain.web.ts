export const setEncryptionKey = async (password: string, shouldEncrypt: boolean = true) => {
    return Promise.resolve('');
};

export const getEncryptionKey = async () => {
    return Promise.resolve({ password: '' });
};

export const clearPassword = async () => {
    return Promise.resolve('');
};
