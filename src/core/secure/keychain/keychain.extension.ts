export const setBaseEncryptionKey = async (password: string, shouldEncrypt: boolean = true) => {
    return Promise.resolve('');
};

export const generateEncryptionKey = async (pinCode: string): Promise<string> => {
    return Promise.resolve('');
};

export const getEncryptionKey = async (pinCode: string) => {
    return Promise.resolve('');
};

export const clearPinCode = async () => {
    return Promise.resolve('');
};

export const getBaseEncryptionKey = async () => {
    return Promise.resolve('');
};

export const clearEncryptionKey = async () => {
    //
};

export const verifyPinCode = async (pinCode: string): Promise<boolean> => {
    return true;
};

export const getPinCode = async () => {
    return Promise.resolve('');
};

export const setPinCode = async (pinCode: string) => {
    //
};

export const setWalletCredentialsKey = async (
    walletPublicKey: string,
    privateKey: string
): Promise<void> => {
    //
};

export const getWalletCredentialsKey = async (walletPublicKey: string): Promise<string> => {
    return Promise.resolve('');
};
