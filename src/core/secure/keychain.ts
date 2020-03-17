import RNSecureKeyStore, { ACCESSIBLE } from 'react-native-secure-key-store';
import { hash } from './encrypt';

const defaultOptions = {
    service: 'com.moonlet'
};

export const setPassword = async (password: string, shouldEncrypt: boolean = true) => {
    try {
        await RNSecureKeyStore.remove(defaultOptions.service);
    } catch (err) {
        //
    }

    if (shouldEncrypt) {
        password = await hash(password);
    }

    await RNSecureKeyStore.set(defaultOptions.service, password, {
        accessible: ACCESSIBLE.WHEN_UNLOCKED
    });
};

export const getPassword = async () => {
    let password = null;
    try {
        password = await RNSecureKeyStore.get(defaultOptions.service);
    } catch (err) {
        // if password it's not set
        // [Error: {"message":"key does not present"}]
    }

    return {
        password
    };
};
