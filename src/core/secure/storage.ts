import AsyncStorage from '@react-native-community/async-storage';
import { encrypt, decrypt } from './encrypt';

const KEY_PREFIX = 'mw-';

export const storeEncrypted = async (data: string, key: string, hash: string) => {
    const encryptedData = await encrypt(data, hash);

    try {
        await AsyncStorage.setItem(`${KEY_PREFIX}${key}`, encryptedData);
    } catch (e) {
        // saving error
    }
};

export const readEncrypted = async (key: string, hash: string) => {
    try {
        const encryptedData = await AsyncStorage.getItem(`${KEY_PREFIX}${key}`);
        if (encryptedData !== null) {
            const data = await decrypt(encryptedData, hash);
            return data;
        }
        return 'xxxxx';
    } catch (e) {
        // error reading value
    }
};
