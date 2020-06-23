import * as Keychain from 'react-native-keychain';
import { generateRandomEncryptionKey, hash } from '../encrypt/encrypt';
import { storeEncrypted, readEncrypted, deleteFromStorage } from '../storage/storage';
import DeviceInfo from 'react-native-device-info';
import uuidv4 from 'uuid/v4';
import { Platform } from 'react-native';
import { captureException as SentryCaptureException } from '@sentry/react-native';

const defaultOptions = {
    serviceEncryption: 'com.moonlet.encryption',
    usernameEncryption: 'moonlet-encryption-key',
    usernamePin: 'moonlet-pin',
    servicePin: 'com.moonlet.pin'
};

export const KEY_PIN_SAMPLE = 'moonletPinSample';

export const iosClearKeychainOnInstall = async () => {
    if (Platform.OS === 'ios') {
        const Settings = require('react-native').Settings;
        if (!Settings.get('appIsInstalled')) {
            clearPinCode();
            await clearEncryptionKey();
            Settings.set({
                appIsInstalled: true
            });
        }
    }
};

export const generateEncryptionKey = async (pinCode: string): Promise<string> => {
    await setBaseEncryptionKey();
    const encryptionKey = await getEncryptionKey(pinCode);
    await storeEncrypted(uuidv4(), KEY_PIN_SAMPLE, encryptionKey);
    return encryptionKey;
};

export const setBaseEncryptionKey = async () => {
    try {
        const encryptionKey = await generateRandomEncryptionKey();
        await Keychain.setGenericPassword(defaultOptions.usernameEncryption, encryptionKey, {
            service: defaultOptions.serviceEncryption,
            storage: Keychain.STORAGE_TYPE.AES,
            accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
            securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
            rules: Keychain.SECURITY_RULES.AUTOMATIC_UPGRADE
        });
    } catch (err) {
        SentryCaptureException(new Error(JSON.stringify(err)));
    }
};

export const getBaseEncryptionKey = async () => {
    await iosClearKeychainOnInstall();
    let password = null;
    try {
        // Retrieve the credentials
        const credentials = await Keychain.getGenericPassword({
            service: defaultOptions.serviceEncryption
        });
        if (credentials) {
            password = credentials.password;
        } else {
            throw new Error(
                'getBaseEncryptionKey: Keychain.getGenericPassword returns falsy value'
            );
        }
    } catch (err) {
        SentryCaptureException(new Error(JSON.stringify(err)));
    }

    return password;
};

export const clearEncryptionKey = async () => {
    try {
        deleteFromStorage(KEY_PIN_SAMPLE);
        await Keychain.resetGenericPassword({ service: defaultOptions.serviceEncryption });
    } catch (err) {
        SentryCaptureException(new Error(JSON.stringify(err)));
    }
};

export const getEncryptionKey = async (pinCode: string) => {
    let password = await getBaseEncryptionKey();
    password = await hash(password || '', pinCode);
    return password;
};

export const verifyPinCode = async (pinCode: string): Promise<boolean> => {
    try {
        const encryptionKey = await getEncryptionKey(pinCode);
        await readEncrypted(KEY_PIN_SAMPLE, encryptionKey);
        return true;
    } catch (err) {
        return false;
    }
};

export const setPinCode = async (pinCode: string) => {
    try {
        await clearPinCode();
        await Keychain.setGenericPassword(defaultOptions.usernamePin, pinCode, {
            service: defaultOptions.servicePin,
            accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
            securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
            authenticationType: Keychain.AUTHENTICATION_TYPE.BIOMETRICS,
            storage: Keychain.STORAGE_TYPE.RSA,
            accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_CURRENT_SET,
            rules: Keychain.SECURITY_RULES.AUTOMATIC_UPGRADE
        });
    } catch (err) {
        SentryCaptureException(new Error(JSON.stringify(err)));
    }
};

export const getPinCode = async () => {
    await iosClearKeychainOnInstall();
    let password = null;
    try {
        // Retrieve the credentials
        const credentials = await Keychain.getGenericPassword({
            service: defaultOptions.servicePin,
            storage: Keychain.STORAGE_TYPE.RSA
        });
        if (credentials) {
            password = credentials.password;
        }
    } catch (error) {
        if (error.message.indexOf('Authentication failed') >= 0) {
            if (DeviceInfo.getManufacturerSync() === 'OnePlus') {
                return Promise.reject('FAILED');
            }
            return getPinCode();
        } else if (
            error.message.indexOf('Cancel') >= 0 ||
            error.message.indexOf('User canceled the operation.') >= 0
        ) {
            return Promise.reject('CANCELED');
        } else if (error.message.indexOf('Too many attempts') >= 0) {
            return Promise.reject('TOO_MANY_ATTEMPTS');
        } else {
            SentryCaptureException(new Error(JSON.stringify(error)));
            return Promise.reject(error.message);
        }
    }

    return password;
};

export const clearPinCode = async () => {
    try {
        await Keychain.resetGenericPassword({ service: defaultOptions.servicePin });
    } catch (err) {
        SentryCaptureException(new Error(JSON.stringify(err)));
    }
};
