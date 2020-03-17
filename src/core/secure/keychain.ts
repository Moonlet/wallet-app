import RNSecureKeyStore, { ACCESSIBLE } from 'react-native-secure-key-store';
import { hash } from './encrypt';

const defaultOptions = {
    service: 'com.moonlet'
};

export const setPassword = async (password: string, shouldEncrypt: boolean = true) => {
    await RNSecureKeyStore.remove(defaultOptions.service).catch(err => {
        //
    });

    if (shouldEncrypt) {
        password = await hash(password);
    }

    await RNSecureKeyStore.set(defaultOptions.service, password, {
        accessible: ACCESSIBLE.WHEN_UNLOCKED
    });
};

export const getPassword = async () => {
    const password = await RNSecureKeyStore.get(defaultOptions.service).catch(err => {
        //
    });

    return {
        password
    };
};
