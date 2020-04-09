import * as Keychain from 'react-native-keychain';
import { generateRandomEncryptionKey, hash } from './encrypt';
import { storeEncrypted, readEncrypted } from './storage';
import uuidv4 from 'uuid/v4';

const defaultOptions = {
    serviceEncryption: 'com.moonlet.encryption',
    usernameEncryption: 'moonlet-encryption-key',
    usernamePin: 'moonlet-pin',
    servicePin: 'com.moonlet.pin'
};

export const KEY_PIN_SAMPLE = 'moonletPinSample';

export const generateEncryptionKey = async (pinCode: string) => {
    await setBaseEncryptionKey();
    const encryptionKey = await getEncryptionKey(pinCode);
    await storeEncrypted(uuidv4(), KEY_PIN_SAMPLE, encryptionKey);
};

export const setBaseEncryptionKey = async () => {
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

export const getBaseEncryptionKey = async () => {
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

    // console.log('get ecnrypti', password);
    return password;
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

export const verifyPinInput = async (
    pinCode: string,
    biometricLogin: boolean
): Promise<boolean> => {
    let code: string = pinCode;
    if (biometricLogin) {
        code = await getPinCode();
    }
    try {
        const encryptionKey = await getEncryptionKey(code);
        await readEncrypted(KEY_PIN_SAMPLE, encryptionKey);
        return true;
    } catch (e) {
        return false;
    }
};

export const setPinCode = async (pinCode: string) => {
    clearPinCode();
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

export const getPinCode = async () => {
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

    return password;
};

export const clearPinCode = async () => {
    try {
        await Keychain.resetGenericPassword({ service: defaultOptions.servicePin });
    } catch (err) {
        //
    }
};
