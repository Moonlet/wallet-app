import * as Keychain from 'react-native-keychain';
import { hash } from './encrypt';

const defaultOptions = {
    service: 'com.moonlet'
};

const USERNAME = 'moonlet-app';

export const setPassword = async (password: string, shouldEncrypt: boolean = true) => {
    await Keychain.resetGenericPassword(defaultOptions);

    if (shouldEncrypt) {
        password = await hash(password);
    }

    await Keychain.setGenericPassword(USERNAME, password, defaultOptions);
};

export const getPassword = async () => {
    return Keychain.getGenericPassword(defaultOptions);
};
