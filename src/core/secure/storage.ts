import AsyncStorage from '@react-native-community/async-storage';
import { encrypt, decrypt } from './encrypt';

const KEY_PREFIX = 'mw-';

export const storeEncrypted = async (data: string, key: string, hash: string) => {
    const encryptedData = await encrypt(data, hash);
    try {
        await AsyncStorage.setItem(`${KEY_PREFIX}${key}`, encryptedData);
    } catch (e) {
        return Promise.reject();
    }
};

export const readEncrypted = async (key: string, hash: string) => {
    try {
        const encryptedData = await AsyncStorage.getItem(`${KEY_PREFIX}${key}`);
        if (encryptedData !== null) {
            const data = await decrypt(encryptedData, hash);
            return data;
        }
        return Promise.reject(`No data in storage for key ${KEY_PREFIX}${key}`);
    } catch (e) {
        return Promise.reject(e);
    }
};

export const deleteFromStorage = async (key: string) => {
    try {
        await AsyncStorage.removeItem(`${KEY_PREFIX}${key}`);
    } catch (e) {
        return Promise.reject(e);
    }
};

export const storeItemToStorage = async (data: string, key: string) => {
    try {
        await AsyncStorage.setItem(`${KEY_PREFIX}${key}`, data);
    } catch (e) {
        return Promise.reject();
    }
};

export const getItemFromStorage = async (key: string) => {
    try {
        return Promise.resolve(await AsyncStorage.getItem(`${KEY_PREFIX}${key}`));
    } catch (e) {
        return Promise.reject(e);
    }
};
