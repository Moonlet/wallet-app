import AsyncStorage from '@react-native-community/async-storage';
import { encrypt, decrypt } from './encrypt';

const KEY_PREFIX = 'mw-';

export const storeEncrypted = async (data: string, key: string, hash: string) => {
    // console.log('storeEncrypted', key, hash);
    const encryptedData = await encrypt(data, hash);
    try {
        await AsyncStorage.setItem(`${KEY_PREFIX}${key}`, encryptedData);
    } catch (e) {
        //     console.log('key could not be stored', key, e);
        return Promise.reject();
    }
};

export const readEncrypted = async (key: string, hash: string) => {
    //  console.log('read ', key, hash);
    try {
        const encryptedData = await AsyncStorage.getItem(`${KEY_PREFIX}${key}`);
        if (encryptedData !== null) {
            const data = await decrypt(encryptedData, hash);
            return data;
        }
        return Promise.reject(`No data in storage for key ${KEY_PREFIX}${key}`);
    } catch (e) {
        //     console.log('ddddddreadEncrypted ', e);
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
