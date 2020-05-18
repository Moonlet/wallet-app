import AsyncStorage from '@react-native-community/async-storage';
import { encrypt, decrypt } from '../encrypt/encrypt';
import { KEY_PREFIX } from './consts';
import * as Sentry from '@sentry/react-native';

export const storeEncrypted = async (data: string, key: string, hash: string): Promise<void> => {
    const encryptedData = await encrypt(data, hash);
    try {
        await AsyncStorage.setItem(`${KEY_PREFIX}${key}`, encryptedData);
    } catch (err) {
        Sentry.captureException(new Error(JSON.stringify(err)));
        return Promise.reject(err);
    }
};

export const readEncrypted = async (key: string, hash: string): Promise<string> => {
    try {
        const encryptedData = await AsyncStorage.getItem(`${KEY_PREFIX}${key}`);
        if (encryptedData !== null) {
            const data = await decrypt(encryptedData, hash);
            return data;
        }
        return Promise.reject(`No data in storage for key ${KEY_PREFIX}${key}`);
    } catch (err) {
        Sentry.captureException(new Error(JSON.stringify(err)));
        return Promise.reject(err);
    }
};

export const deleteFromStorage = async (key: string): Promise<void> => {
    try {
        await AsyncStorage.removeItem(`${KEY_PREFIX}${key}`);
    } catch (err) {
        Sentry.captureException(new Error(JSON.stringify(err)));
        return Promise.reject(err);
    }
};

export const storeItemToStorage = async (data: string, key: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(`${KEY_PREFIX}${key}`, data);
    } catch (err) {
        Sentry.captureException(new Error(JSON.stringify(err)));
        return Promise.reject(err);
    }
};

export const getItemFromStorage = async (key: string): Promise<string> => {
    try {
        return Promise.resolve(await AsyncStorage.getItem(`${KEY_PREFIX}${key}`));
    } catch (err) {
        Sentry.captureException(new Error(JSON.stringify(err)));
        return Promise.reject(err);
    }
};
