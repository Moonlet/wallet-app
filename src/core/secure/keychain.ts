import * as Keychain from 'react-native-keychain';
import { generateRandomEncryptionKey, hash } from './encrypt';
import { storeEncrypted, readEncrypted } from './storage';

const defaultOptions = {
    serviceEncryption: 'com.moonlet.encryption',
    usernameEncryption: 'moonlet-encryption-key',
    usernamePin: 'moonlet-pin',
    servicePin: 'com.moonlet.pin'
};

const stateToEncrypt = 'this is a test to encrypt password';

export const generateEncryptionKey = async (pinCode: string) => {
    await setEncryptionKey();
    const encryptionKey = await getEncryptionKey(pinCode);
    await storeEncrypted(stateToEncrypt, 'stateToEncrypt', encryptionKey);
};

export const setEncryptionKey = async () => {
    const encryptionKey = await generateRandomEncryptionKey();
    try {
        await Keychain.setGenericPassword(defaultOptions.usernameEncryption, encryptionKey, {
            service: defaultOptions.serviceEncryption,
            storage: Keychain.STORAGE_TYPE.AES,
            accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
            securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
            rules: Keychain.SECURITY_RULES.AUTOMATIC_UPGRADE
        });
    } catch (e) {
        //    console.log('error set encryption password', e);
    }
};

export const getEncryptionKey = async (pinCode: string) => {
    let password = null;
    try {
        // Retrieve the credentials
        const credentials = await Keychain.getGenericPassword({
            service: defaultOptions.serviceEncryption
        });
        if (credentials) {
            password = credentials.password;
        } else {
            //     console.log(' get encryption key');
        }
    } catch (error) {
        //  console.log("Keychain couldn't be accessed!", error);
    }
    if (password !== null) {
        password = await hash(password, pinCode);
    }
    // console.log('get ecnrypti', password);
    return password;
};

export const verifyPinInput = async (pinCode: string): Promise<boolean> => {
    try {
        const encryptionKey = await getEncryptionKey(pinCode);
        //  console.log('vvvv', encryptionKey, pinCode);
        const state = await readEncrypted('stateToEncrypt', encryptionKey);
        //  console.log('vvvv', encryptionKey, pinCode);
        return stateToEncrypt === state;
    } catch (e) {
        return false;
    }
};

export const setPassword = async (pinCode: string) => {
    clearPassword();
    try {
        await Keychain.setGenericPassword(defaultOptions.usernamePin, pinCode, {
            service: defaultOptions.servicePin,
            accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
            securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
            authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
            storage: Keychain.STORAGE_TYPE.RSA,
            accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
            rules: Keychain.SECURITY_RULES.AUTOMATIC_UPGRADE
        });
    } catch (e) {
        //  console.log('set Password error', e);
    }
};

export const getPassword = async () => {
    let password = null;
    try {
        // Retrieve the credentials
        const credentials = await Keychain.getGenericPassword({
            service: defaultOptions.servicePin,
            storage: Keychain.STORAGE_TYPE.RSA
        });
        if (credentials) {
            password = credentials.password;
        } else {
            //       console.log('No credentials stored get password');
        }
    } catch (error) {
        //    console.log("Keychain couldn't be accessed!", error);
    }

    return {
        password
    };
};

export const clearPassword = async () => {
    try {
        await Keychain.resetGenericPassword({ service: defaultOptions.servicePin });
    } catch (err) {
        //
    }
};
