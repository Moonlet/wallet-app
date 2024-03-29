import * as Keychain from 'react-native-keychain';
import { generateRandomEncryptionKey, hash } from '../encrypt/encrypt';
import { storeEncrypted, readEncrypted, deleteFromStorage } from '../storage/storage';
import DeviceInfo from 'react-native-device-info';
import { v4 as uuidv4 } from 'uuid';
import { Platform } from 'react-native';
import {
    addBreadcrumb as SentryAddBreadcrumb,
    captureException as SentryCaptureException
} from '@sentry/react-native';

const defaultOptions = {
    serviceEncryption: 'com.moonlet.encryption',
    usernameEncryption: 'moonlet-encryption-key',
    usernamePin: 'moonlet-pin',
    servicePin: 'com.moonlet.pin'
};

export const KEY_PIN_SAMPLE = 'moonletPinSample';

export const iosClearKeychainOnInstall = async (options?: { walletPublicKey?: string }) => {
    if (Platform.OS === 'ios') {
        const Settings = require('react-native').Settings;
        if (!Settings.get('appIsInstalled')) {
            if (options?.walletPublicKey) {
                await clearWalletCredentialsKey(options.walletPublicKey);
            }
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
    } catch (error) {
        SentryAddBreadcrumb({
            message: JSON.stringify({
                error
            })
        });

        SentryCaptureException(new Error(`Failed to set base encryption key, ${error?.message}`));
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
    } catch (error) {
        SentryAddBreadcrumb({
            message: JSON.stringify({
                error
            })
        });

        SentryCaptureException(new Error(`Failed to get base encryption key, ${error?.message}`));
    }

    return password;
};

export const clearEncryptionKey = async () => {
    try {
        deleteFromStorage(KEY_PIN_SAMPLE);
        await Keychain.resetGenericPassword({ service: defaultOptions.serviceEncryption });
    } catch (error) {
        SentryAddBreadcrumb({
            message: JSON.stringify({
                error
            })
        });

        SentryCaptureException(new Error(`Failed to clear encryption key, ${error?.message}`));
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
    } catch (error) {
        SentryAddBreadcrumb({
            message: JSON.stringify({
                error
            })
        });

        SentryCaptureException(new Error(`Failed to set pin, ${error?.message}`));
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
    } catch (error) {
        SentryAddBreadcrumb({
            message: JSON.stringify({
                error
            })
        });

        SentryCaptureException(new Error(`Failed to clean pin code, ${error?.message}`));
    }
};

export const setWalletCredentialsKey = async (
    walletPublicKey: string,
    privateKey: string
): Promise<void> => {
    try {
        await Keychain.setGenericPassword(`${walletPublicKey}-username`, privateKey, {
            service: walletPublicKey,
            storage: Keychain.STORAGE_TYPE.AES,
            accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
            securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
            rules: Keychain.SECURITY_RULES.AUTOMATIC_UPGRADE
        });
    } catch (error) {
        SentryAddBreadcrumb({
            message: JSON.stringify({
                error
            })
        });

        SentryCaptureException(
            new Error(`Failed to set wallet credentials key, ${error?.message}`)
        );

        throw new Error(error);
    }
};

export const getWalletCredentialsKey = async (walletPublicKey: string): Promise<string> => {
    await iosClearKeychainOnInstall({ walletPublicKey });
    let password = null;
    try {
        // Retrieve the credentials
        const credentials = await Keychain.getGenericPassword({
            service: walletPublicKey
        });

        if (credentials) {
            password = credentials.password;
        } else {
            throw new Error(
                'getWalletCredentialsKey: Keychain.getGenericPassword returns falsy value'
            );
        }
    } catch (error) {
        SentryAddBreadcrumb({
            message: JSON.stringify({
                error
            })
        });

        SentryCaptureException(
            new Error(`Failed to get wallet credentials key, ${error?.message}`)
        );
    }

    return password;
};

export const clearWalletCredentialsKey = async (walletPublicKey: string) => {
    try {
        await Keychain.resetGenericPassword({ service: walletPublicKey });
    } catch (error) {
        SentryAddBreadcrumb({
            message: JSON.stringify({
                error
            })
        });

        SentryCaptureException(
            new Error(`Failed to clear wallet credentials key, ${error?.message}`)
        );
    }
};
